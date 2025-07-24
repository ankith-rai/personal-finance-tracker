import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UPDATE_INVOICE, DELETE_INVOICE } from '../graphql/queries';

const GET_INVOICES = gql`
  query GetInvoices {
    getInvoices {
      id
      number
      clientName
      clientEmail
      dueDate
      total
      status
      transactions {
        id
        description
        amount
        date
      }
    }
  }
`;

const CREATE_INVOICE = gql`
  mutation CreateInvoice($transactions: [ID!]!, $clientName: String!, $clientEmail: String!, $dueDate: String!) {
    createInvoice(transactions: $transactions, clientName: $clientName, clientEmail: $clientEmail, dueDate: $dueDate) {
      id
      number
      clientName
      clientEmail
      dueDate
      total
      status
    }
  }
`;

const GET_TRANSACTIONS = gql`
  query GetTransactions {
    getTransactions {
      id
      description
      amount
      date
      type
      category
    }
  }
`;

const Invoices: React.FC = () => {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editInvoice, setEditInvoice] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    clientName: '',
    clientEmail: '',
    dueDate: '',
    status: '',
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const { loading: loadingInvoices, error: errorInvoices, data: invoiceData } = useQuery(GET_INVOICES);
  const { loading: loadingTransactions, error: errorTransactions, data: transactionData } = useQuery(GET_TRANSACTIONS);
  const [createInvoice] = useMutation(CREATE_INVOICE, {
    refetchQueries: [{ query: GET_INVOICES }],
  });

  const [updateInvoice] = useMutation(UPDATE_INVOICE, {
    refetchQueries: [{ query: GET_INVOICES }],
    onCompleted: () => {
      setEditOpen(false);
      setEditInvoice(null);
      setEditSubmitting(false);
      setEditError('');
    },
    onError: (err) => {
      setEditError('Failed to update invoice.');
      setEditSubmitting(false);
    }
  });
  const [deleteInvoice] = useMutation(DELETE_INVOICE, {
    refetchQueries: [{ query: GET_INVOICES }],
    onCompleted: () => {
      setDeleteOpen(false);
      setDeleteInvoiceId(null);
      setDeleteSubmitting(false);
    },
    onError: () => {
      setDeleteOpen(false);
      setDeleteInvoiceId(null);
      setDeleteSubmitting(false);
    }
  });

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueDate) return;

    try {
      await createInvoice({
        variables: {
          transactions: selectedTransactions,
          clientName,
          clientEmail,
          dueDate: dueDate.toISOString().split('T')[0],
        },
      });
      setSelectedTransactions([]);
      setClientName('');
      setClientEmail('');
      setDueDate(null);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const toggleTransaction = (transactionId: string) => {
    setSelectedTransactions(prev =>
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  // Edit handlers
  const handleEditOpen = (invoice: any) => {
    setEditInvoice(invoice);
    setEditForm({
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      dueDate: invoice.dueDate,
      status: invoice.status,
    });
    setEditOpen(true);
    setEditError('');
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setEditInvoice(null);
    setEditForm({ clientName: '', clientEmail: '', dueDate: '', status: '' });
    setEditError('');
    setEditSubmitting(false);
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditError('');
    try {
      await updateInvoice({
        variables: {
          id: editInvoice.id,
          clientName: editForm.clientName,
          clientEmail: editForm.clientEmail,
          dueDate: editForm.dueDate,
          status: editForm.status,
        },
      });
    } catch (err) {
      setEditError('Failed to update invoice.');
      setEditSubmitting(false);
    }
  };

  // Delete handlers
  const handleDeleteOpen = (id: string) => {
    setDeleteInvoiceId(id);
    setDeleteOpen(true);
    setDeleteSubmitting(false);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setDeleteInvoiceId(null);
    setDeleteSubmitting(false);
  };
  const handleDeleteConfirm = async () => {
    if (!deleteInvoiceId) return;
    setDeleteSubmitting(true);
    try {
      await deleteInvoice({ variables: { id: deleteInvoiceId } });
    } catch (err) {
      setDeleteOpen(false);
      setDeleteInvoiceId(null);
      setDeleteSubmitting(false);
    }
  };

  if (loadingInvoices || loadingTransactions) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (errorInvoices || errorTransactions) {
    return (
      <Container>
        <Alert severity="error">Error loading data</Alert>
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PENDING':
        return 'warning';
      default:
        return 'error';
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Invoices
      </Typography>

      {/* Create Invoice Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Create New Invoice
        </Typography>
        <Box component="form" onSubmit={handleCreateInvoice} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Email"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={(newValue) => setDueDate(newValue)}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Select Transactions
              </Typography>
              <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                <List>
                  {transactionData?.getTransactions.map((transaction: any) => (
                    <React.Fragment key={transaction.id}>
                      <ListItem
                        onClick={() => toggleTransaction(transaction.id)}
                        secondaryAction={
                          <Typography variant="body2" color="text.secondary">
                            ${transaction.amount}
                          </Typography>
                        }
                        sx={{ cursor: 'pointer' }}
                      >
                        <Checkbox
                          edge="start"
                          checked={selectedTransactions.includes(transaction.id)}
                          tabIndex={-1}
                          disableRipple
                        />
                        <ListItemText
                          primary={transaction.description}
                          secondary={`${transaction.type} - ${transaction.category}`}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!clientName || !clientEmail || !dueDate || selectedTransactions.length === 0}
              >
                Create Invoice
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Invoices List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Invoices
        </Typography>
        <Grid container spacing={3}>
          {invoiceData?.getInvoices && invoiceData.getInvoices.length > 0 ? (
            invoiceData.getInvoices.map((invoice: any) => (
              <Grid item xs={12} key={invoice.id}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Typography variant="h6" gutterBottom>
                          Invoice #{invoice.number}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                          Client: {invoice.clientName}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                          Email: {invoice.clientEmail}
                        </Typography>
                        <Typography color="text.secondary">
                          Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" gutterBottom>
                          ${invoice.total}
                        </Typography>
                        <Chip
                          label={invoice.status}
                          color={getStatusColor(invoice.status) as any}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <EditIcon sx={{ cursor: 'pointer', mr: 1 }} onClick={() => handleEditOpen(invoice)} />
                        <DeleteIcon sx={{ cursor: 'pointer' }} color="error" onClick={() => handleDeleteOpen(invoice.id)} />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          Transactions:
                        </Typography>
                        {invoice.transactions && invoice.transactions.length > 0 ? (
                          <List dense>
                            {invoice.transactions.map((transaction: any) => (
                              <ListItem key={transaction.id}>
                                <ListItemText
                                  primary={transaction.description}
                                  secondary={new Date(transaction.date).toLocaleDateString()}
                                />
                                <Typography variant="body2">
                                  ${transaction.amount}
                                </Typography>
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                            No transactions for this invoice.
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
                No invoices found.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Edit Invoice Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Invoice</DialogTitle>
        <Divider />
        <form onSubmit={handleEditSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 3 }}>
            <TextField
              label="Client Name"
              name="clientName"
              value={editForm.clientName}
              onChange={handleEditChange}
              fullWidth
              required
            />
            <TextField
              label="Client Email"
              name="clientEmail"
              type="email"
              value={editForm.clientEmail}
              onChange={handleEditChange}
              fullWidth
              required
            />
            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              value={editForm.dueDate}
              onChange={handleEditChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Status"
              name="status"
              value={editForm.status}
              onChange={handleEditChange}
              select
              fullWidth
              required
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </TextField>
            {editError && <Alert severity="error">{editError}</Alert>}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleEditClose} disabled={editSubmitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={editSubmitting}>
              {editSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Delete Invoice Dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Invoice</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>Are you sure you want to delete this invoice?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} disabled={deleteSubmitting}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleteSubmitting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Invoices; 