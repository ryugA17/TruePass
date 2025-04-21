import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import TOTPGenerator from '../components/totp/TOTPGenerator';
import TOTPValidator from '../components/totp/TOTPValidator';
import { TOTPService, TOTPSecret } from '../services/TOTPService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`totp-tabpanel-${index}`}
      aria-labelledby={`totp-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `totp-tab-${index}`,
    'aria-controls': `totp-tabpanel-${index}`,
  };
}

const TOTPManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [secrets, setSecrets] = useState<TOTPSecret[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [secretToDelete, setSecretToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'info' | 'warning' | 'error',
  });

  // Load secrets from local storage
  const loadSecrets = () => {
    const storedSecrets = TOTPService.getSecrets();
    setSecrets(storedSecrets);
  };

  useEffect(() => {
    loadSecrets();
    // Clear expired secrets
    TOTPService.clearExpiredSecrets();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSecretGenerated = () => {
    loadSecrets();
  };

  const handleDeleteClick = (id: string) => {
    setSecretToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (secretToDelete) {
      const success = TOTPService.deleteSecret(secretToDelete);
      if (success) {
        loadSecrets();
        setNotification({
          open: true,
          message: 'Ticket deleted successfully',
          severity: 'success',
        });
      } else {
        setNotification({
          open: true,
          message: 'Failed to delete ticket',
          severity: 'error',
        });
      }
    }
    setDeleteDialogOpen(false);
    setSecretToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSecretToDelete(null);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Ticket Verification System
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Generate and validate TOTP codes for secure offline ticket verification
      </Typography>

      <Paper sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="TOTP management tabs"
            centered
          >
            <Tab label="Generate Codes" {...a11yProps(0)} />
            <Tab label="Validate Tickets" {...a11yProps(1)} />
            <Tab label="Manage Tickets" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <TOTPGenerator onSecretGenerated={handleSecretGenerated} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TOTPValidator />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Stored Tickets</Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={loadSecrets}
              variant="outlined"
              size="small"
            >
              Refresh
            </Button>
          </Box>
          <Divider />
          {secrets.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No tickets found. Generate a new ticket to get started.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setTabValue(0)}
                sx={{ mt: 2 }}
              >
                Generate New Ticket
              </Button>
            </Box>
          ) : (
            <List>
              {secrets.map(secret => (
                <ListItem key={secret.id} divider>
                  <ListItemText
                    primary={`${secret.issuer} - ${secret.label}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Created: {formatDate(secret.createdAt)}
                        </Typography>
                        <br />
                        <Typography
                          component="span"
                          variant="body2"
                          color={
                            secret.expiresAt && secret.expiresAt < Date.now()
                              ? 'error'
                              : 'text.secondary'
                          }
                        >
                          Expires: {formatDate(secret.expiresAt)}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteClick(secret.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Ticket</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this ticket? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TOTPManagement;
