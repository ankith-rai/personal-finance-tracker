import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TRANSACTIONS, CREATE_TRANSACTION } from "../graphql/queries";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Fab, MenuItem, Box
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
  });
  const [formError, setFormError] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ description: '', amount: '', date: '', type: '', category: '' });
    setFormError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.description || !form.amount || !form.date || !form.type || !form.category) {
      setFormError('All fields are required.');
      return;
    }
    try {
      await createTransaction({
        variables: {
          description: form.description,
          amount: parseFloat(form.amount),
          date: form.date,
          type: form.type,
          category: form.category,
        },
      });
    } catch (err) {
      setFormError('Failed to add transaction.');
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
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ step: '0.01' }}
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              fullWidth
              required
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
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
              required
            />
            {formError && <Box color="error.main">{formError}</Box>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Transactions;
