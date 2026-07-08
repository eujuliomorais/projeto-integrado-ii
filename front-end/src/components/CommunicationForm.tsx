import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import birthdayBg from '../assets/bg fundo.svg';
import { useAuth } from '../hooks/useAuth';
import { api_base_url } from '../services/api';
import { authGetProfile } from '../services/auth/authService';
import {
  getBirthdayTemplate,
  getMailingRecipients,
  sendMailing,
  updateBirthdayTemplate,
  type MailingRecipientScope,
} from '../services/mailing/mailingService';
import { getAvatar } from '../services/user/imageService';
import TextEditor from './TextEditor';

type Snack = { open: boolean; severity: 'success' | 'error'; msg: string };

type AudienceOption = 'todos' | 'associados' | 'gerenciadores';

const SCOPE_MAP: Record<AudienceOption, MailingRecipientScope> = {
  todos: 'ALL',
  associados: 'ASSOCIATES',
  gerenciadores: 'ADMINS_AND_CONSULTANTS',
};

/* ── aba "Enviar Mensagem" ─────────────────────────────────────────── */

const SendMessageTab = () => {
  const { token } = useAuth();
  const [subject, setSubject] = useState('');
  const [audience, setAudience] = useState<AudienceOption | null>(null);
  const [sending, setSending] = useState(false);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });
  const editorRef = useRef<HTMLDivElement>(null);
  const [hasBodyContent, setHasBodyContent] = useState(false);

  const checkBodyContent = () => {
    const hasText = !!editorRef.current?.textContent?.trim();
    const hasImg = !!editorRef.current?.querySelector('img');
    return hasText || hasImg;
  };

  const handleSend = async () => {
    if (!token) return;

    const body = editorRef.current?.innerHTML ?? '';
    if (!subject.trim() || !checkBodyContent()) return;

    setSending(true);
    try {
      // 1. busca a lista de destinatários pelo escopo selecionado
      const recipients = await getMailingRecipients(
        token,
        SCOPE_MAP[audience!]
      );
      const emails = recipients.map((r) => r.email);

      if (emails.length === 0) {
        setSnack({
          open: true,
          severity: 'error',
          msg: 'Nenhum destinatário encontrado para o público selecionado.',
        });
        return;
      }

      // 2. envia a mensagem
      const result = await sendMailing(token, {
        subject,
        message: body,
        emails,
      });
      setSnack({
        open: true,
        severity: 'success',
        msg: `Mensagem enviada com sucesso para ${result.sentCount} destinatário(s)!`,
      });

      setSubject('');
      setHasBodyContent(false);
      if (editorRef.current) editorRef.current.innerHTML = '';
    } catch {
      setSnack({
        open: true,
        severity: 'error',
        msg: 'Erro ao tentar enviar mensagem!',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <TextField
          label="Assunto do e-mail"
          placeholder="Digite o assunto da mensagem"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          size="small"
          fullWidth
        />

        <TextEditor
          editorRef={editorRef}
          onInput={() => setHasBodyContent(checkBodyContent())}
        />

        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <RadioGroup
            row
            value={audience ?? ''}
            onChange={(e) => setAudience(e.target.value as AudienceOption)}
          >
            <FormControlLabel
              value="todos"
              control={<Radio size="small" />}
              label="Todos"
            />
            <FormControlLabel
              value="associados"
              control={<Radio size="small" />}
              label="Associados"
            />
            <FormControlLabel
              value="gerenciadores"
              control={<Radio size="small" />}
              label="Administradores e Consultores"
            />
          </RadioGroup>
          <Button
            variant="contained"
            color="primary"
            startIcon={sending ? undefined : <SendIcon sx={{ fontSize: 16 }} />}
            onClick={handleSend}
            disabled={
              sending || !subject.trim() || !hasBodyContent || !audience
            }
            sx={{
              borderRadius: 10,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            {sending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Enviar Mensagem'
            )}
          </Button>
        </Stack>
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

/* ── aba "Mensagem de Aniversário" ─────────────────────────────────── */

const BIRTHDAY_INITIAL_HTML =
  '<p style="text-align:center"><b style="color:#E36D3B">Feliz Aniversário! 🎂</b></p>' +
  '<p style="text-align:center">Olá {name},</p>' +
  '<p style="text-align:center">Parabéns pelo seu aniversário!<br>' +
  'O Grupo Cultural Dom Maurício deseja a você um dia incrível e cheio de alegria!</p>' +
  '<p style="text-align:center"><em>Grupo Cultural de Dom Maurício</em></p>';

const BirthdayTemplateTab = () => {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    severity: 'success',
    msg: '',
  });
  const editorRef = useRef<HTMLDivElement>(null);
  const [previewHtml, setPreviewHtml] = useState(BIRTHDAY_INITIAL_HTML);
  const [, setUserAvatar] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('Associado');

  useEffect(() => {
    const loadProfileAndAvatar = async () => {
      if (token) {
        try {
          const profile = await authGetProfile({ token });
          if (profile) {
            setDisplayName(profile.name ?? 'Associado');
            if (profile.id) {
              const avatarUrl = await getAvatar({ token, id: profile.id });
              setUserAvatar(avatarUrl ? `${api_base_url}${avatarUrl}` : '');
            }
          }
        } catch {
          setUserAvatar('');
        }
      }
    };
    loadProfileAndAvatar();
  }, [token]);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!token) return;
      try {
        const msg = await getBirthdayTemplate(token);
        const content = msg?.trim() ? msg : BIRTHDAY_INITIAL_HTML;
        if (editorRef.current) {
          editorRef.current.innerHTML = content;
          setPreviewHtml(content);
        }
      } catch {
        if (editorRef.current) {
          editorRef.current.innerHTML = BIRTHDAY_INITIAL_HTML;
          setPreviewHtml(BIRTHDAY_INITIAL_HTML);
        }
      }
    };
    fetchTemplate();
  }, [token]);

  const handleInput = () => {
    setPreviewHtml(editorRef.current?.innerHTML ?? '');
  };

  const previewHtmlWithName = previewHtml.replace(/\{name\}/gi, displayName);

  const handleSave = async () => {
    if (!token) return;

    const message = editorRef.current?.innerHTML ?? '';
    if (!message.trim()) return;

    setSaving(true);
    try {
      await updateBirthdayTemplate(token, message);
      setSnack({
        open: true,
        severity: 'success',
        msg: 'Mensagem de aniversário salva com sucesso!',
      });
    } catch {
      setSnack({
        open: true,
        severity: 'error',
        msg: 'Erro ao salvar mensagem de aniversário.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700 }}
            color="text.secondary"
          >
            Configurar Mensagem Padrão de Aniversário
          </Typography>

          <TextEditor
            editorRef={editorRef}
            placeholder="Digite a mensagem aqui..."
            onInput={handleInput}
          />

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
              sx={{
                borderRadius: 10,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              {saving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={1} sx={{ minWidth: { md: 300 } }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700 }}
            color="text.secondary"
          >
            Pré Visualização
          </Typography>

          <Box
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              overflow: 'hidden',
              backgroundImage: `url(${birthdayBg})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              aspectRatio: { xs: '4 / 5', sm: '1 / 1' },
              width: '100%',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 2, sm: 3 },
                gap: { xs: 1, sm: 1.5 },
                textAlign: 'center',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  maxWidth: { xs: '85%', sm: '72%' },
                  textAlign: 'center',
                  fontSize: { xs: 12, sm: 14 },
                  lineHeight: { xs: 1.4, sm: 1.8 },
                  fontFamily: '"Open Sans", Arial, sans-serif',
                  wordBreak: 'break-word',
                  overflow: 'hidden',
                  '& p': { margin: { xs: '0 0 4px 0', sm: '0 0 6px 0' } },
                  '& b, & strong': { fontWeight: 700 },
                }}
                dangerouslySetInnerHTML={{ __html: previewHtmlWithName }}
              />
            </Box>
          </Box>
        </Stack>
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

/* ── componente principal ──────────────────────────────────────────── */

const CommunicationForm = () => {
  const [tab, setTab] = useState(0);

  return (
    <Stack spacing={2.5}>
      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{
            px: { xs: 0, sm: 2 },
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: 12, sm: 13 },
              whiteSpace: 'normal',
              lineHeight: 1.2,
            },
          }}
        >
          <Tab label="Enviar Mensagem" />
          <Tab label="Definir mensagem padrão de aniversário" />
        </Tabs>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {tab === 0 ? <SendMessageTab /> : <BirthdayTemplateTab />}
        </Box>
      </Paper>
    </Stack>
  );
};

export default CommunicationForm;
