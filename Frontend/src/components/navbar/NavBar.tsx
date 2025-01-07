"use client";
import { Button, Container, styled, Toolbar } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

interface NavBarProps {
  title: string;
}

const AppBar = styled(
  MuiAppBar,
  {}
)<MuiAppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const NavBar: React.FC<NavBarProps> = ({ title }: NavBarProps) => {
  const { address, isDisconnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {title}
          <>
            {" "}
            {isDisconnected ? (
              <>
                {connectors.map((connector, idx) => (
                  <Button
                    color="inherit"
                    key={connector.id}
                    onClick={() => {
                      connect({ connector });
                    }}
                  >
                    {connector.name}
                  </Button>
                ))}{" "}
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => {
                  disconnect();
                }}
              >
                Disconnect {address}
              </Button>
            )}
          </>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
