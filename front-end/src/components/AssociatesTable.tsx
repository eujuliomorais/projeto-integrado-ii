import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Popover,
  Select,
  Skeleton,
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
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { adminFetchAssociates } from '../services/admin/adminService';

import type {
  Associate,
  AssociateCategoryResponse,
} from '../services/associate/associate.types';

import { useAuth } from '../hooks/useAuth';
import { api_base_url } from '../services/api';
import { getCategories } from '../services/associate/associateService';
import { decodeJwt } from '../services/auth/jwt.config';
import { maskCPF } from '../utils/masks.util';

type ChipColor = 'success' | 'warning' | 'default' | 'error';

const ROWS_PER_PAGE = 10;

interface FilterState {
  status: 'Ativo' | 'Inativo' | 'Todos';
  categoria: string;
}

const EMPTY_FILTER: FilterState = {
  status: 'Todos',
  categoria: 'Todas',
};

interface FilterPopoverProps {
  anchor: HTMLElement | null;
  onClose: () => void;
  onApply: (f: FilterState) => void;
}

const FilterPopover = ({ anchor, onClose, onApply }: FilterPopoverProps) => {
  const { token, logout } = useAuth();

  const [local, setLocal] = useState<FilterState>(EMPTY_FILTER);

  const [categories, setCategories] = useState<AssociateCategoryResponse[]>([]);

  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) => {
    setLocal((p) => ({ ...p, [k]: v }));
  };

  useEffect(() => {
    const loadCategories = async () => {
      if (!token) {
        logout();
        return;
      }

      const categories = await getCategories(token);
      setCategories(categories);
    };

    void loadCategories();
  }, [token, logout]);

  return (
    <Popover
      open={Boolean(anchor)}
      anchorEl={anchor}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        paper: { sx: { borderRadius: 3, p: 2.5, width: 260, mt: 0.5 } },
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography sx={{ fontWeight: 700 }} variant="subtitle1">
            Filtros
          </Typography>

          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <FormControl size="small" fullWidth>
          <InputLabel>Status</InputLabel>

          <Select
            value={local.status}
            label="Status"
            onChange={(e) =>
              set('status', e.target.value as FilterState['status'])
            }
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Ativo">Ativo</MenuItem>
            <MenuItem value="Inativo">Inativo</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel>Categoria</InputLabel>

          <Select
            value={local.categoria}
            label="Categoria"
            onChange={(e) =>
              set('categoria', e.target.value as FilterState['categoria'])
            }
          >
            <MenuItem value="Todas">Todas</MenuItem>

            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            onApply(local);
            onClose();
          }}
          sx={{ borderRadius: 10, textTransform: 'none', fontWeight: 700 }}
        >
          Filtrar
        </Button>
      </Stack>
    </Popover>
  );
};

const AssociatesTable = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const user = token ? decodeJwt(token) : null;

  const filterBtnRef = useRef<HTMLButtonElement>(null);

  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);

  const [search, setSearch] = useState('');

  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<Associate[]>([]);

  const [, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAssociates = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token');

        if (!token) return;

        const data = await adminFetchAssociates({
          bearerToken: token,
        });

        setUsers(data);

        setTotalPages(Math.max(1, Math.ceil(data.length / ROWS_PER_PAGE)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociates();
  }, []);

  const filtered = users.filter((u) => {
    const searchTerm = search.trim().toLowerCase();

    const name = (u.user?.name ?? '').toLowerCase();
    const cpf = u.cpf ?? '';
    const cardNumber = String(u.cardNumber ?? '');

    const status = u.user?.active ? 'Ativo' : 'Inativo';

    const matchSearch =
      name.includes(searchTerm) ||
      cpf.includes(searchTerm) ||
      cardNumber.includes(searchTerm);

    const matchStatus = filters.status === 'Todos' || status === filters.status;

    const matchCategoria =
      filters.categoria === 'Todas' ||
      u.workCategory?.name === filters.categoria;

    return matchSearch && matchStatus && matchCategoria;
  });

  const calculatedTotalPages = Math.max(
    1,
    Math.ceil(filtered.length / ROWS_PER_PAGE)
  );

  const safePage = Math.min(page, calculatedTotalPages);

  const paginated = filtered.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE
  );

  const displayFrom =
    filtered.length === 0 ? 0 : (safePage - 1) * ROWS_PER_PAGE + 1;

  const displayTo = Math.min(safePage * ROWS_PER_PAGE, filtered.length);

  const hasFilters = Object.values(filters).some(Boolean);

  const pageItems = (): (number | '...')[] => {
    if (calculatedTotalPages <= 5)
      return Array.from({ length: calculatedTotalPages }, (_, i) => i + 1);

    if (safePage <= 3) return [1, 2, 3, '...', calculatedTotalPages];

    if (safePage >= calculatedTotalPages - 2)
      return [
        1,
        '...',
        calculatedTotalPages - 2,
        calculatedTotalPages - 1,
        calculatedTotalPages,
      ];

    return [
      1,
      '...',
      safePage - 1,
      safePage,
      safePage + 1,
      '...',
      calculatedTotalPages,
    ];
  };

  return (
    <Stack spacing={2.5}>
      {/* Actions row */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ justifyContent: 'flex-end' }}
      >
        {user?.role !== 'CONSULTANT' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/associados/novo')}
            sx={{
              fontWeight: 600,
              borderRadius: 10,
              textTransform: 'none',
              px: 3,
            }}
          >
            Adicionar Associado
          </Button>
        )}

        <Button
          ref={filterBtnRef}
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={(e) => setFilterAnchor(e.currentTarget)}
          sx={{
            fontWeight: 600,
            borderRadius: 10,
            textTransform: 'none',
            px: 3,
            borderColor: hasFilters ? 'primary.main' : 'text.secondary',
            color: hasFilters ? 'primary.main' : 'text.secondary',
          }}
        >
          {hasFilters ? 'Filtros ativos' : 'Adicionar Filtros'}
        </Button>
      </Stack>

      {/* Search */}
      <TextField
        placeholder="Pesquise por nome, CPF ou número do associado"
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
          },
        }}
        sx={{ bgcolor: 'background.paper' }}
      />

      {/* Table */}
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
                {['NOME', 'CPF', 'CATEGORIA', 'STATUS', 'Nº'].map((h) => (
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
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      bgcolor: i % 2 === 1 ? 'grey.100' : 'background.paper',
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Stack
                        direction="row"
                        sx={{ alignItems: 'center' }}
                        spacing={2}
                      >
                        <Skeleton variant="circular" width={52} height={52} />

                        <Skeleton width={160} />
                      </Stack>
                    </TableCell>

                    {[120, 100, 80].map((w, j) => (
                      <TableCell key={j}>
                        <Skeleton width={w} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{ py: 5, color: 'text.disabled' }}
                  >
                    Nenhum associado encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((u, idx) => {
                  const st = u.user?.active
                    ? {
                        label: 'Ativo',
                        color: 'success' as ChipColor,
                      }
                    : {
                        label: 'Inativo',
                        color: 'default' as ChipColor,
                      };

                  return (
                    <TableRow
                      key={u.id}
                      hover
                      onClick={() => navigate(`/admin/associados/${u.id}`)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor:
                          idx % 2 === 1 ? 'grey.100' : 'background.paper',
                        '&:hover': { bgcolor: 'custom.orange.light30' },
                        '&:last-child td': { border: 0 },
                      }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Stack
                          direction="row"
                          sx={{ alignItems: 'center' }}
                          spacing={2}
                        >
                          <Avatar
                            src={
                              u.user?.avatarUrl
                                ? `${api_base_url}${u.user.avatarUrl}`
                                : undefined
                            }
                            sx={{
                              width: 52,
                              height: 52,
                              bgcolor: 'primary.main',
                            }}
                          >
                            <PersonOutlineIcon
                              sx={{ color: '#ffffff', fontSize: 34 }}
                            />
                          </Avatar>

                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {u.user?.name ?? '-'}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {maskCPF(u.cpf) ?? '-'}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {u.workCategory?.name ?? '-'}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={st.label}
                          size="small"
                          color={st.color}
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            fontSize: 11,
                            borderRadius: 1,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {u.cardNumber ?? '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginação */}
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
                    fontSize: 13,
                    color:
                      safePage === item ? 'primary.main' : 'text.secondary',
                    fontWeight: safePage === item ? 700 : 400,
                    borderBottom:
                      safePage === item ? '2px solid' : '2px solid transparent',
                    borderColor:
                      safePage === item ? 'primary.main' : 'transparent',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {item}
                </Box>
              )
            )}

            <IconButton
              size="small"
              onClick={() =>
                setPage((p) => Math.min(calculatedTotalPages, p + 1))
              }
              disabled={safePage === calculatedTotalPages}
            >
              <Box component="span" sx={{ fontSize: 18, lineHeight: 1 }}>
                ›
              </Box>
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      {/* Filter Popover */}
      <FilterPopover
        anchor={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        onApply={(f) => {
          setFilters(f);
          setPage(1);
        }}
      />
    </Stack>
  );
};

export default AssociatesTable;
