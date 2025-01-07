'use client'

import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Alert, Box, Snackbar } from '@mui/material';
import NavBar from '../../components/navbar/NavBar';
import useSnackBar from '../../hooks/useSnackBar';

interface MainLayoutProps {
  fullWidth?: boolean;
}

const Main = styled('main', {
  shouldForwardProp: (prop) =>
    prop !== 'fullWidth',
})<MainLayoutProps>(({ theme, fullWidth }) => ({
  flexGrow: 1,
  padding: `${theme.spacing(10)} ${theme.spacing(10)}`,
  [theme.breakpoints.up('md')]: {
    padding: `${theme.spacing(10)} ${theme.spacing(fullWidth ? 10 : 20)}`,
  },
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentMessage, removeCurrentMessage } = useSnackBar();
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        backgroundColor: 'whitesmoke',
      }}
    >
      <CssBaseline />
      <NavBar
        title={'Home'}
      />
      <Main fullWidth={true}> 
                {children}
      </Main>
      {currentMessage && (
        <Snackbar
          open={!!currentMessage}
          autoHideDuration={currentMessage?.time ?? 6000}
          onClose={removeCurrentMessage}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={removeCurrentMessage}
            severity={currentMessage?.type}
            sx={{ width: '100%' }}
          >
            {currentMessage.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};
