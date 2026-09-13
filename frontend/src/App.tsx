/**
 * Racine de l’application et table des routes. Les providers globaux vivent
 * ici ; les pages gardent leur logique dans leur dossier de fonctionnalité.
 */
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { PageLayout } from '@/components/layout/PageLayout'
import { ArtisanDetailPage } from '@/features/artisans/ArtisanDetailPage'
import { ArtisansPage } from '@/features/artisans/ArtisansPage'
import { AuthProvider } from '@/features/auth/AuthContext'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'

function App() {
  return (
    <BrowserRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <AuthProvider>
        <PageLayout>
          <Routes>
            <Route element={<Navigate replace to="/artisans" />} path="/" />
            <Route element={<ArtisansPage />} path="/artisans" />
            <Route element={<ArtisanDetailPage />} path="/artisans/:id" />
            <Route element={<LoginPage />} path="/connexion" />
            <Route element={<RegisterPage />} path="/inscription" />
            <Route element={<Navigate replace to="/artisans" />} path="*" />
          </Routes>
        </PageLayout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
