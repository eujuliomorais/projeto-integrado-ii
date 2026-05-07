import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UserType = 'Administrador' | 'Circulador';

interface AccessUser {
  id: string;
  name: string;
  cpf: string;
  type: UserType;
}

// TODO: substituir por chamada de API
const MOCK_USERS: AccessUser[] = [
  {
    id: '1',
    name: 'João da Silva',
    cpf: '000.000.000-00',
    type: 'Administrador',
  },
  {
    id: '2',
    name: 'Maria Lopes Braga',
    cpf: '111.111.111-11',
    type: 'Administrador',
  },
  {
    id: '3',
    name: 'Ana Safira Lima',
    cpf: '222.222.222-22',
    type: 'Circulador',
  },
  {
    id: '4',
    name: 'Gabriel Mendes',
    cpf: '333.333.333-33',
    type: 'Circulador',
  },
];

const ROWS_PER_PAGE = 4;

const AccessControlSearchTable = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | UserType>('Todos');
  const [page, setPage] = useState(1);

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.cpf.includes(search);
    const matchType = typeFilter === 'Todos' || u.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE
  );
  const displayFrom =
    filtered.length === 0 ? 0 : (safePage - 1) * ROWS_PER_PAGE + 1;
  const displayTo = Math.min(safePage * ROWS_PER_PAGE, filtered.length);

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleType = (v: 'Todos' | UserType) => {
    setTypeFilter(v);
    setPage(1);
  };

  const pageItems = (): (number | '...')[] => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, '...', totalPages];
    if (safePage >= totalPages - 2)
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages];
  };

  return (
    <Stack spacing={2.5}>
      {/* botão */}
      <Stack
        direction="row"
        sx={{
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/controle-de-acesso/novo')}
          sx={{
            fontWeight: 600,
            borderRadius: 10,
            textTransform: 'none',
            px: 3,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Adicionar novo acesso
        </Button>
      </Stack>

      {/* Filtros */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          placeholder="Procure um Administrador ou Consultor"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleSearch('')}
                    edge="end"
                  >
                    <ClearIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
          sx={{ bgcolor: 'background.paper' }}
        />

        <FormControl
          size="small"
          sx={{ minWidth: 160, bgcolor: 'background.paper' }}
        >
          <InputLabel>Tipo</InputLabel>
          <Select
            value={typeFilter}
            label="Tipo"
            onChange={(e) => handleType(e.target.value as typeof typeFilter)}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Administrador">Administrador</MenuItem>
            <MenuItem value="Circulador">Circulador</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Tabela */}
      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.paper' }}>
                {['NOME', 'CPF', 'TIPO'].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      fontSize: 16,
                      letterSpacing: 0.5,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{ py: 5, color: 'text.disabled' }}
                  >
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((user, idx) => (
                  <TableRow
                    key={user.id}
                    hover
                    onClick={() => navigate(`/controle-de-acesso/${user.id}`)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: idx % 2 === 1 ? 'grey.100' : 'background.paper',
                      '&:hover': { bgcolor: 'custom.orange.light30' },
                      '&:last-child td': { border: 0 },
                    }}
                  >
                    <TableCell sx={{ py: 1.5 }}>
                      <Stack
                        direction="row"
                        sx={{ alignItems: 'center' }}
                        spacing={2}
                      >
                        <Avatar
                          sx={{ width: 48, height: 48, bgcolor: 'grey.400' }}
                        >
                          <PersonIcon
                            sx={{ color: 'grey.100', fontSize: 30 }}
                          />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {user.cpf}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {user.type}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Rodapé paginação */}
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Exibindo {displayFrom} - {displayTo} de {filtered.length} associados
          </Typography>

          <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >
              <Box component="span" sx={{ fontSize: 18, lineHeight: 1 }}>
                ‹
              </Box>
            </IconButton>

            {pageItems().map((item, i) =>
              item === '...' ? (
                <Typography
                  key={`e-${i}`}
                  variant="body2"
                  sx={{ px: 0.5, color: 'text.disabled' }}
                >
                  ...
                </Typography>
              ) : (
                <Box
                  key={item}
                  onClick={() => setPage(item as number)}
                  sx={{
                    px: 0.75,
                    py: 0.25,
                    cursor: 'pointer',
                    color:
                      safePage === item ? 'primary.main' : 'text.secondary',
                    fontWeight: safePage === item ? 700 : 400,
                    fontSize: 13,
                    borderBottom:
                      safePage === item ? '2px solid' : '2px solid transparent',
                    borderColor:
                      safePage === item ? 'primary.main' : 'transparent',
                    transition: 'all 0.15s',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {item}
                </Box>
              )
            )}

            <IconButton
              size="small"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >
              <Box component="span" sx={{ fontSize: 18, lineHeight: 1 }}>
                ›
              </Box>
            </IconButton>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default AccessControlSearchTable;
