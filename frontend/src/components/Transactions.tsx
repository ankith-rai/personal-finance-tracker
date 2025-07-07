import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TRANSACTIONS, CREATE_TRANSACTION } from "../graphql/queries";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Fab, MenuItem, Box, Snackbar, Alert, InputAdornment, Typography, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';

const StyledTableContainer = styled(TableContainer)({
  maxWidth: 650,
  margin: 'auto',
  marginTop: 16,
});

const StyledTable = styled(Table)({
  minWidth: 650,
  backgroundColor: '#f5f5f5',
});

const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  backgroundColor: '#e0e0e0',
});

const CATEGORY_OPTIONS = [
  'Salary', 'Groceries', 'Utilities', 'Rent', 'Dining', 'Travel', 'Shopping', 'Health', 'Education', 'Other'
];

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
}

const Transactions: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_TRANSACTIONS);
  const [createTransaction] = useMutation(CREATE_TRANSACTION, {
    onCompleted: () => {
      setSuccess(true);
      handleClose();
      refetch();
    },
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: '',
    type: '',
    category: '',
    customCategory: '',
  });
  const [formError, setFormError] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ description: '', amount: '', date: '', type: '', category: '', customCategory: '' });
    setFormError({});
    setSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError({ ...formError, [e.target.name]: '' });
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!form.description.trim()) errors.description = 'Description is required.';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) errors.amount = 'Enter a positive amount.';
    if (!form.date) errors.date = 'Date is required.';
    if (!form.type) errors.type = 'Type is required.';
    if (!form.category && !form.customCategory.trim()) errors.category = 'Category is required.';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError({});
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }
    setSubmitting(true);
    try {
      await createTransaction({
        variables: {
          description: form.description,
          amount: parseFloat(form.amount),
          date: form.date,
          type: form.type,
          category: form.category === 'custom' ? form.customCategory : form.category,
        },
      });
    } catch (err) {
      setFormError({ submit: 'Failed to add transaction.' });
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box position="relative">
      <StyledTableContainer>
        <StyledTable>
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell align="right">Amount</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.getTransactions.map((transaction: Transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell align="right">{transaction.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
      >
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Add Transaction</DialogTitle>
        <Divider />
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 3 }}>
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              required
              error={!!formError.description}
              helperText={formError.description || 'E.g. Grocery shopping, Salary, etc.'}
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              fullWidth
              required
              error={!!formError.amount}
              helperText={formError.amount || 'Enter a positive value'}
              inputProps={{ step: '0.01', min: 0 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              fullWidth
              required
              error={!!formError.date}
              helperText={formError.date || ''}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              select
              fullWidth
              required
              error={!!formError.type}
              helperText={formError.type || ''}
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              select
              fullWidth
              required={!form.customCategory}
              error={!!formError.category}
              helperText={formError.category || 'Choose a category or select Other to enter your own'}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
              <MenuItem value="custom">Other (Custom)</MenuItem>
            </TextField>
            {form.category === 'custom' && (
              <TextField
                label="Custom Category"
                name="customCategory"
                value={form.customCategory}
                onChange={handleChange}
                fullWidth
                required
                error={!!formError.category}
                helperText={formError.category || 'Enter your custom category'}
              />
            )}
            {formError.submit && <Alert severity="error">{formError.submit}</Alert>}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Transaction added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Transactions;
