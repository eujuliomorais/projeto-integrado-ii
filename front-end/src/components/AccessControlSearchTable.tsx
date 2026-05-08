import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Button,
  CircularProgress,
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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { normalizeRoleView, type Role } from '../services/auth/roles';
import type { User } from '../services/user/user.types';
import { getUsers } from '../services/user/userService';

const AccessControlSearchTable = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | Role>('Todos');
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const data = await getUsers({
          page: page - 1,
        });

        setUsers(data.content);
        setTotalPages(data.totalPages || 1);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.cpf.includes(search);

    const matchType = typeFilter === 'Todos' || u.role === typeFilter;

    return matchSearch && matchType;
  });

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

      {/* filtros */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          placeholder="Procure um Administrador ou Consultor"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
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
                    onClick={() => setSearch('')}
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
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="SUPER_ADMIN">Controle de Acesso</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="CONSULTANT">Consultor</MenuItem>
            <MenuItem value="ASSOCIATE">Associado</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* tabela */}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, idx) => (
                  <TableRow
                    key={user.id}
                    hover
                    onClick={() => navigate(`/controle-de-acesso/${user.id}`)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: idx % 2 === 1 ? 'grey.100' : 'background.paper',
                      '&:hover': {
                        bgcolor: 'custom.orange.light30',
                      },
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
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: 'grey.400',
                          }}
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
                        {normalizeRoleView(user.role)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* paginação */}
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
          Página {page} de {totalPages}
        </Typography>

        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>

          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AccessControlSearchTable;
