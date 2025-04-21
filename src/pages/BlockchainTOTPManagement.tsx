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
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import VerifiedIcon from '@mui/icons-material/Verified';
import BlockchainTOTPGenerator from '../components/blockchain/BlockchainTOTPGenerator';
import BlockchainTOTPValidator from '../components/blockchain/BlockchainTOTPValidator';
import { BlockchainTOTPService, TOTPSecret } from '../services/BlockchainTOTPService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
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
};

const a11yProps = (index: number) => {
  return {
    id: `totp-tab-${index}`,
    'aria-controls': `totp-tabpanel-${index}`,
  };
};

const BlockchainTOTPManagement: React.FC = () => {
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
  useEffect(() => {
    loadSecrets();
    // Clear expired secrets
    BlockchainTOTPService.clearExpiredSecrets();
  }, []);

  const loadSecrets = () => {
    const loadedSecrets = BlockchainTOTPService.getSecrets();
    setSecrets(loadedSecrets);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Reload secrets when switching to the manage tab
    if (newValue === 2) {
      loadSecrets();
    }
  };

  const handleSecretGenerated = (secret: TOTPSecret) => {
    loadSecrets();
    // Switch to the validate tab
    setTabValue(1);
  };

  const handleDeleteClick = (id: string) => {
    setSecretToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (secretToDelete) {
      const success = BlockchainTOTPService.deleteSecret(secretToDelete);
      if (success) {
        setNotification({
          open: true,
          message: 'Ticket deleted successfully',
          severity: 'success',
        });
        loadSecrets();
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
      <Typography variant="h4" component="h1" gutterBottom>
        Blockchain Ticket Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Generate, validate, and manage blockchain-based TOTP tickets
      </Typography>

      <Paper sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="TOTP management tabs"
            centered
          >
            <Tab label="Generate Tickets" {...a11yProps(0)} />
            <Tab label="Validate Tickets" {...a11yProps(1)} />
            <Tab label="Manage Tickets" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <BlockchainTOTPGenerator onSecretGenerated={handleSecretGenerated} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <BlockchainTOTPValidator />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Manage Tickets
          </Typography>

          {secrets.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No tickets found. Generate a ticket first.
            </Typography>
          ) : (
            <List>
              {secrets.map(secret => (
                <React.Fragment key={secret.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1">{secret.issuer}</Typography>
                          {secret.tokenId && (
                            <Chip
                              icon={<VerifiedIcon />}
                              label="On Blockchain"
                              size="small"
                              color="primary"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            ID: {secret.id}
                          </Typography>
                          {secret.tokenId && (
                            <Typography variant="body2" component="div">
                              Token ID: {secret.tokenId}
                            </Typography>
                          )}
                          <Typography variant="body2" component="div">
                            Created: {formatDate(secret.createdAt)}
                          </Typography>
                          <Typography variant="body2" component="div">
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
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadSecrets}
              sx={{ mr: 1 }}
            >
              Refresh List
            </Button>
          </Box>
        </TabPanel>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Ticket</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this ticket?</Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
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

export default BlockchainTOTPManagement;
