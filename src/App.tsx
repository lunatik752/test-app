import { lazy, Suspense } from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header.tsx';
import UserAccount from './components/UserAccount/UserAccount.tsx';


const RequestJournal = lazy(() => import('./components/RequestJournal/RequestJournal.tsx'));
const Archive = lazy(() => import('./components/Arhive/Archive.tsx'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage/NotFoundPage.tsx'));

function App() {
  return (
      <BrowserRouter>
          <Header />
          <Routes>
              <Route path='/' element={<UserAccount />} />
              <Route path='/requestJournal' element={<Suspense><RequestJournal /></Suspense>} />
              <Route path='/archive' element={<Suspense><Archive /></Suspense>} />
              <Route path={'*'} element={<Suspense><NotFoundPage/></Suspense>}/>
          </Routes>
      </BrowserRouter>
  )
}

export default App
