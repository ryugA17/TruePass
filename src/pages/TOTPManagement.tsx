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
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 6,
        background: 'linear-gradient(135deg, #040615 0%, #040615 100%)',
        minHeight: '100vh',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.2) 0%, rgba(108,99,255,0) 70%)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.15) 0%, rgba(45,212,191,0) 70%)',
          zIndex: 0,
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: 'white',
            mb: 2,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textFillColor: 'transparent',
          }}
        >
          Ticket Verification System
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Generate and validate TOTP codes for secure offline ticket verification
        </Typography>

        <Paper
          sx={{
            width: '100%',
            mt: 3,
            borderRadius: '16px',
            background: 'rgba(28, 28, 56, 0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="TOTP management tabs"
              centered
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 600,
                  px: 3,
                  py: 2,
                  '&.Mui-selected': {
                    color: 'white',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              <Tab label="Generate Codes" {...a11yProps(0)} />
              <Tab label="Manage Tickets" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <TOTPGenerator onSecretGenerated={handleSecretGenerated} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                Stored Tickets
              </Typography>
              <Button
                startIcon={<RefreshIcon />}
                onClick={loadSecrets}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: '10px',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'primary.main',
                    background: 'rgba(108, 99, 255, 0.08)',
                  },
                }}
              >
                Refresh
              </Button>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
            {secrets.length === 0 ? (
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  No tickets found. Generate a new ticket to get started.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setTabValue(0)}
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #6C63FF, #4B44CC)',
                    boxShadow: '0 4px 10px rgba(108, 99, 255, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7E77FF, #5955D9)',
                      boxShadow: '0 6px 15px rgba(108, 99, 255, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Generate New Ticket
                </Button>
              </Box>
            ) : (
              <List
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                {secrets.map(secret => (
                  <ListItem
                    key={secret.id}
                    divider
                    sx={{
                      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
                      py: 1.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'white' }}>
                          {secret.issuer} - {secret.label}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography
                            component="span"
                            variant="body2"
                            color="rgba(255, 255, 255, 0.7)"
                          >
                            Created: {formatDate(secret.createdAt)}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{
                              color:
                                secret.expiresAt && secret.expiresAt < Date.now()
                                  ? 'error.main'
                                  : 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            Expires: {formatDate(secret.expiresAt)}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(secret.id)}
                        sx={{
                          color: 'rgba(255, 77, 77, 0.8)',
                          '&:hover': {
                            color: 'error.main',
                            bgcolor: 'rgba(255, 77, 77, 0.08)',
                          },
                        }}
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
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(22, 28, 36, 0.95)',
              backgroundImage: 'none',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              py: 1,
            },
          }}
        >
          <DialogTitle id="delete-dialog-title" sx={{ color: 'white', fontWeight: 600 }}>
            Delete Ticket
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Are you sure you want to delete this ticket? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleDeleteCancel}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              sx={{
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(255, 77, 77, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 15px rgba(255, 77, 77, 0.4)',
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="filled"
            sx={{
              width: '100%',
              borderRadius: '12px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default TOTPManagement;
