import { Link, Route, Routes } from "react-router-dom";

  import WelcomePage from "./components/WelcomePage";
  import RouteExplorer from './views/RouteExplorer';
  import Purity from './views/PurityOverview';
  import Metrics from './views/Metrics';
  import AppBar from '@mui/material/AppBar';
  import Container from '@mui/material/Container';
  import Typography from '@mui/material/Typography';
  import MenuItem from '@mui/material/MenuItem';
  import { useNavigate } from "react-router-dom";
  import Toolbar from '@mui/material/Toolbar';
  import { useSelector } from "react-redux";
  import { RootState } from "./store";
  import LoadingScreen from './views/LoadingScreen'
  // import logospin from './assets/logocirclespin.gif'





  export default function App() {
    const navigate = useNavigate();
    
    const loading = useSelector((state: RootState) => state.views.loading);
    
    const navToRE = () => {
      navigate("/rexplorer");
    }

    const navToPO = () => {
      navigate('/purity');
    }

    const navToHome = () => {
      navigate('/');
    }

    if (loading) return (
      <div>
        <LoadingScreen/>
      </div>
    )

    return (
      <div>
        <AppBar style={{backgroundColor : '#255858'}}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'arial',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                CARIBU
              </Typography>
              <MenuItem onClick={navToRE}>
                <Typography textAlign="center">Route Explorer</Typography>
              </MenuItem>
              <MenuItem onClick={navToPO}>
                <Typography textAlign="center">Purity Overview</Typography>
              </MenuItem>
              <MenuItem onClick={navToHome}>
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
            </Toolbar>
          </Container>
        </AppBar>
        {/* <div>
          <Link to="/">Welcome page</Link>
        </div>
        <div>
          <Link to="/rexplorer">Route Explorer</Link>
        </div>
        <div>
          <Link to="/purity">Purity Overview</Link>
        </div>
        <div>
          <Link to="/metrics">Metrics</Link>
        </div> */}
        <Routes>
          <Route path='/' element={<WelcomePage/>}/>
          <Route path='/rexplorer' element={<RouteExplorer/>}/>
          <Route path='/purity' element={<Purity/>}/>
          <Route path='/metrics' element={<Metrics/>}/>
        </Routes>
      </div>
    );
  }
