import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatItalicIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useRef, useState } from 'react';

const ToolbarBtn = ({
  title,
  icon,
  onAction,
}: {
  title: string;
  icon: React.ReactNode;
  onAction: () => void;
}) => (
  <Tooltip title={title}>
    <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); onAction(); }}>
      {icon}
    </IconButton>
  </Tooltip>
);


interface TextEditorProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  placeholder?: string;
  onInput?: () => void;
}

const TextEditor = ({
  editorRef,
  placeholder = 'Digite sua mensagem aqui...',
  onInput,
}: TextEditorProps) => {
  const [linkAnchor, setLinkAnchor] = useState<HTMLElement | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isEditingLink, setIsEditingLink] = useState(false);
  const editingLinkRef = useRef<HTMLAnchorElement | null>(null);

  const [linkTooltipAnchor, setLinkTooltipAnchor] = useState<HTMLElement | null>(null);
  const [hoveredLink, setHoveredLink] = useState<HTMLAnchorElement | null>(null);


  const wrapSelectionWithMarker = (markerId: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const range = sel.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return false;

    unwrapMarker(markerId);

    const marker = document.createElement('span');
    marker.id = markerId;

    try {
      range.surroundContents(marker);
    } catch {
      const fragment = range.extractContents();
      marker.appendChild(fragment);
      range.insertNode(marker);
    }
    sel.removeAllRanges();
    return true;
  };

  const unwrapMarker = (markerId: string) => {
    const marker = editorRef.current?.querySelector(`#${markerId}`);
    if (!marker) return;
    const parent = marker.parentNode;
    if (!parent) return;
    while (marker.firstChild) {
      parent.insertBefore(marker.firstChild, marker);
    }
    parent.removeChild(marker);
  };

  const restoreSelectionFromMarker = (markerId: string) => {
    const marker = editorRef.current?.querySelector(`#${markerId}`);
    if (!marker) return false;
    
    editorRef.current?.focus();
    const sel = window.getSelection();
    const newRange = document.createRange();
    newRange.selectNodeContents(marker);
    sel?.removeAllRanges();
    sel?.addRange(newRange);
    return true;
  };


  const exec = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    onInput?.();
  };

  const changeFontSize = (dir: 'up' | 'down') => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;

    const range = sel.getRangeAt(0);

    // Detecta o tamanho atual do elemento sob a seleção
    const ancestor = range.commonAncestorContainer;
    const el =
      ancestor instanceof Element ? ancestor : ancestor.parentElement;
    const cur = el ? parseInt(window.getComputedStyle(el).fontSize) : 14;
    const next = dir === 'up' ? Math.min(cur + 2, 96) : Math.max(cur - 2, 8);

    const span = document.createElement('span');
    span.style.fontSize = `${next}px`;

    try {
      // surroundContents funciona quando a seleção não cruza elementos de bloco
      range.surroundContents(span);
    } catch {
      // Fallback para seleções que cruzam múltiplos elementos
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }

    // Mantém a seleção sobre o span inserido
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(newRange);

    onInput?.();
  };


  const openLinkPopover = (anchor: HTMLElement, existing?: HTMLAnchorElement) => {
    if (existing) {
      editingLinkRef.current = existing;
      setIsEditingLink(true);
      setLinkUrl(existing.href);
      setLinkText(existing.textContent || '');
    } else {
      editingLinkRef.current = null;
      setIsEditingLink(false);
      const marker = editorRef.current?.querySelector('#link-marker');
      setLinkText(marker ? marker.textContent || '' : '');
      setLinkUrl('');
    }
    setLinkAnchor(anchor);
  };

  const closeLinkPopover = () => {
    unwrapMarker('link-marker');
    setLinkAnchor(null);
    setLinkUrl('');
    setLinkText('');
    editingLinkRef.current = null;
    setIsEditingLink(false);
  };

  const confirmLink = () => {
    if (!linkUrl) {
      unwrapMarker('link-marker');
      return;
    }

    const normalizedUrl =
      /^(https?:\/\/|mailto:)/i.test(linkUrl) ? linkUrl : `https://${linkUrl}`;

    if (editingLinkRef.current) {
      editingLinkRef.current.href = normalizedUrl;
      if (linkText) editingLinkRef.current.textContent = linkText;
      onInput?.();
      closeLinkPopover();
      return;
    }

    const linkEl = document.createElement('a');
    linkEl.href = normalizedUrl;
    linkEl.textContent = linkText || normalizedUrl;
    linkEl.target = '_blank';
    linkEl.rel = 'noopener noreferrer';

    const marker = editorRef.current?.querySelector('#link-marker');
    if (marker && marker.parentNode) {
      marker.parentNode.replaceChild(linkEl, marker);
    } else {
      editorRef.current?.appendChild(linkEl);
    }

    onInput?.();
    closeLinkPopover();
  };

  const removeLink = (link: HTMLAnchorElement) => {
    link.parentNode?.replaceChild(document.createTextNode(link.textContent || ''), link);
    setLinkTooltipAnchor(null);
    setHoveredLink(null);
    onInput?.();
  };

  const handleEditorClick = useCallback((e: React.MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest('a') as HTMLAnchorElement | null;
    if (anchor && editorRef.current?.contains(anchor)) {
      e.preventDefault();
      setHoveredLink(anchor);
      setLinkTooltipAnchor(anchor);
    } else {
      setLinkTooltipAnchor(null);
      setHoveredLink(null);
    }
  }, [editorRef]);

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); confirmLink(); }
  };

  return (
    <>
      <Paper variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
        {/* toolbar */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            px: 1, py: 0.5,
            borderBottom: '1px solid', borderColor: 'divider',
            alignItems: 'center', flexWrap: 'wrap',
          }}
        >
          <ToolbarBtn title="Negrito"    icon={<FormatBoldIcon fontSize="small" />}       onAction={() => exec('bold')} />
          <ToolbarBtn title="Itálico"    icon={<FormatItalicIcon fontSize="small" />}     onAction={() => exec('italic')} />
          <ToolbarBtn title="Sublinhado" icon={<FormatUnderlinedIcon fontSize="small" />} onAction={() => exec('underline')} />

          <ToolbarBtn title="Lista com marcadores" icon={<FormatListBulletedIcon fontSize="small" />} onAction={() => exec('insertUnorderedList')} />
          <ToolbarBtn title="Lista numerada"       icon={<FormatListNumberedIcon fontSize="small" />} onAction={() => exec('insertOrderedList')} />

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          <ToolbarBtn title="Alinhar à esquerda" icon={<FormatAlignLeftIcon fontSize="small" />}   onAction={() => exec('justifyLeft')} />
          <ToolbarBtn title="Centralizar"         icon={<FormatAlignCenterIcon fontSize="small" />} onAction={() => exec('justifyCenter')} />
          <ToolbarBtn title="Alinhar à direita"   icon={<FormatAlignRightIcon fontSize="small" />}  onAction={() => exec('justifyRight')} />

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* cor do texto */}
          <Tooltip title="Cor do texto">
            <IconButton size="small" component="label" sx={{ position: 'relative', overflow: 'hidden' }}>
              <FormatColorTextIcon fontSize="small" />
              <Box
                component="input"
                type="color"
                onMouseDown={() => wrapSelectionWithMarker('color-marker')}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (restoreSelectionFromMarker('color-marker')) {
                    exec('foreColor', e.target.value);
                    unwrapMarker('color-marker');
                  }
                }}
                sx={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          <ToolbarBtn title="Diminuir fonte" icon={<Typography sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1 }}>A−</Typography>} onAction={() => changeFontSize('down')} />
          <ToolbarBtn title="Aumentar fonte" icon={<Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>A+</Typography>} onAction={() => changeFontSize('up')} />

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          <Tooltip title="Inserir link">
            <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); wrapSelectionWithMarker('link-marker'); openLinkPopover(e.currentTarget); }}>
              <InsertLinkIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* área editável */}
        <Box
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={onInput}
          onBlur={() => {}}
          onKeyUp={() => {}}
          onMouseUp={() => {}}
          onClick={handleEditorClick}
          sx={{
            minHeight: 200, p: 1.5,
            fontFamily: '"Open Sans", Arial, sans-serif',
            fontSize: 14, color: 'text.primary', outline: 'none',
            '& p': { margin: '0 0 8px 0' },
            '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1 },
            '& ul': { listStyleType: 'disc', paddingLeft: '24px', margin: '4px 0' },
            '& ol': { listStyleType: 'decimal', paddingLeft: '24px', margin: '4px 0' },
            '& li': { marginBottom: '2px' },
            '& a': { color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' },
            '&:empty::before': { content: `"${placeholder}"`, color: 'text.disabled' },
          }}
        />
      </Paper>

      {/* popover inserir / editar link */}
      <Popover
        open={Boolean(linkAnchor)}
        anchorEl={linkAnchor}
        onClose={closeLinkPopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { borderRadius: 2, p: 2, width: 340 } } }}
      >
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {isEditingLink ? 'Editar Link' : 'Inserir Link'}
          </Typography>
          <TextField label="URL" placeholder="https://exemplo.com" size="small" fullWidth
            value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} autoFocus onKeyDown={handleEnter} />
          <TextField label="Texto do link (opcional)" placeholder="Clique aqui" size="small" fullWidth
            value={linkText} onChange={(e) => setLinkText(e.target.value)} onKeyDown={handleEnter} />
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
            <Button size="small" onClick={closeLinkPopover}
              startIcon={<CloseIcon sx={{ fontSize: 16 }} />}
              sx={{ textTransform: 'none', borderRadius: 6, color: 'text.secondary' }}>
              Cancelar
            </Button>
            <Button size="small" variant="contained" onClick={confirmLink} disabled={!linkUrl}
              startIcon={<CheckIcon sx={{ fontSize: 16 }} />}
              sx={{ textTransform: 'none', borderRadius: 6 }}>
              {isEditingLink ? 'Salvar' : 'Inserir'}
            </Button>
          </Stack>
        </Stack>
      </Popover>

      {/* tooltip flutuante de link existente */}
      <Popover
        open={Boolean(linkTooltipAnchor)}
        anchorEl={linkTooltipAnchor}
        onClose={() => { setLinkTooltipAnchor(null); setHoveredLink(null); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableAutoFocus disableEnforceFocus
        slotProps={{ paper: { sx: { borderRadius: 2, px: 1.5, py: 0.5, display: 'flex', alignItems: 'center', gap: 1 } } }}
      >
        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'primary.main', fontSize: 12 }}>
          {hoveredLink?.href}
        </Typography>
        <Tooltip title="Editar link">
          <IconButton size="small" onClick={() => { if (hoveredLink) { setLinkTooltipAnchor(null); openLinkPopover(hoveredLink, hoveredLink); } }}>
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remover link">
          <IconButton size="small" color="error" onClick={() => { if (hoveredLink) removeLink(hoveredLink); }}>
            <LinkOffIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Popover>

    </>
  );
};

export default TextEditor;
