import { Outlet } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';

const MainLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  minHeight: '100vh',
  overflow: 'hidden',
  width: '100%'
}));

const MainLayoutWrapper = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  width: '100%'
});

const MainLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  width: '100%'
});

const MainLayoutContent = styled('div')({
  flex: '1 1 auto',
  overflow: 'auto',
  width: '100%'
});

const MainLayout = () => (
  <MainLayoutRoot>
    <MainLayoutWrapper>
      <MainLayoutContainer>
        <MainLayoutContent>
          <Outlet />
        </MainLayoutContent>
      </MainLayoutContainer>
    </MainLayoutWrapper>
  </MainLayoutRoot>
);

export default MainLayout;
