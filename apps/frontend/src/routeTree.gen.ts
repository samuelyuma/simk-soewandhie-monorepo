/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthenticatedRouteImport } from './routes/_authenticated/route'
import { Route as IndexImport } from './routes/index'
import { Route as authLoginImport } from './routes/(auth)/login'
import { Route as AuthenticatedSuperadminRouteImport } from './routes/_authenticated/_superadmin/route'
import { Route as AuthenticatedPptkLayoutRouteImport } from './routes/_authenticated/_pptkLayout/route'
import { Route as AuthenticatedSuperadminSuperadminIndexImport } from './routes/_authenticated/_superadmin/superadmin/index'
import { Route as AuthenticatedPptkLayoutPptkIndexImport } from './routes/_authenticated/_pptkLayout/pptk/index'
import { Route as AuthenticatedPptkLayoutPptkPlafonRouteImport } from './routes/_authenticated/_pptkLayout/pptk/plafon/route'
import { Route as AuthenticatedPptkLayoutPptkLaporanRouteImport } from './routes/_authenticated/_pptkLayout/pptk/laporan/route'
import { Route as AuthenticatedSuperadminSuperadminAkunIndexImport } from './routes/_authenticated/_superadmin/superadmin/akun/index'
import { Route as AuthenticatedPptkLayoutPptkNpdIndexImport } from './routes/_authenticated/_pptkLayout/pptk/npd/index'
import { Route as AuthenticatedPptkLayoutPptkPlafonAnggaranIndexImport } from './routes/_authenticated/_pptkLayout/pptk/plafon/anggaran/index'
import { Route as AuthenticatedPptkLayoutPptkNpdNpdIdIndexImport } from './routes/_authenticated/_pptkLayout/pptk/npd/$npdId/index'
import { Route as AuthenticatedPptkLayoutPptkLaporanLpjIndexImport } from './routes/_authenticated/_pptkLayout/pptk/laporan/lpj/index'
import { Route as AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdIndexImport } from './routes/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/index'
import { Route as AuthenticatedPptkLayoutPptkNpdNpdIdPdfIndexImport } from './routes/_authenticated/_pptkLayout/pptk/npd/$npdId/pdf/index'
import { Route as AuthenticatedPptkLayoutPptkLaporanLpjPdfIndexImport } from './routes/_authenticated/_pptkLayout/pptk/laporan/lpj/pdf/index'
import { Route as AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteImport } from './routes/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/route'
import { Route as AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdIndexImport } from './routes/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/index'
import { Route as AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteImport } from './routes/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/route'
import { Route as AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRekeningIdIndexImport } from './routes/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId/index'

// Create/Update Routes

const AuthenticatedRouteRoute = AuthenticatedRouteImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const authLoginRoute = authLoginImport.update({
  id: '/(auth)/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedSuperadminRouteRoute =
  AuthenticatedSuperadminRouteImport.update({
    id: '/_superadmin',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any)

const AuthenticatedPptkLayoutRouteRoute =
  AuthenticatedPptkLayoutRouteImport.update({
    id: '/_pptkLayout',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any)

const AuthenticatedSuperadminSuperadminIndexRoute =
  AuthenticatedSuperadminSuperadminIndexImport.update({
    id: '/superadmin/',
    path: '/superadmin/',
    getParentRoute: () => AuthenticatedSuperadminRouteRoute,
  } as any)

const AuthenticatedPptkLayoutPptkIndexRoute =
  AuthenticatedPptkLayoutPptkIndexImport.update({
    id: '/pptk/',
    path: '/pptk/',
    getParentRoute: () => AuthenticatedPptkLayoutRouteRoute,
  } as any)

const AuthenticatedPptkLayoutPptkPlafonRouteRoute =
  AuthenticatedPptkLayoutPptkPlafonRouteImport.update({
    id: '/pptk/plafon',
    path: '/pptk/plafon',
    getParentRoute: () => AuthenticatedPptkLayoutRouteRoute,
  } as any)

const AuthenticatedPptkLayoutPptkLaporanRouteRoute =
  AuthenticatedPptkLayoutPptkLaporanRouteImport.update({
    id: '/pptk/laporan',
    path: '/pptk/laporan',
    getParentRoute: () => AuthenticatedPptkLayoutRouteRoute,
  } as any)

const AuthenticatedSuperadminSuperadminAkunIndexRoute =
  AuthenticatedSuperadminSuperadminAkunIndexImport.update({
    id: '/superadmin/akun/',
    path: '/superadmin/akun/',
    getParentRoute: () => AuthenticatedSuperadminRouteRoute,
  } as any)

const AuthenticatedPptkLayoutPptkNpdIndexRoute =
  AuthenticatedPptkLayoutPptkNpdIndexImport.update({
    id: '/pptk/npd/',
    path: '/pptk/npd/',
    getParentRoute: () => AuthenticatedPptkLayoutRouteRoute,
  } as any)

const AuthenticatedPptkLayoutPptkPlafonAnggaranIndexRoute =
  AuthenticatedPptkLayoutPptkPlafonAnggaranIndexImport.update({
    id: '/anggaran/',
    path: '/anggaran/',
    getParentRoute: () => AuthenticatedPptkLayoutPptkPlafonRouteRoute,
  } as any)

const AuthenticatedPptkLayoutPptkNpdNpdIdIndexRoute =
  AuthenticatedPptkLayoutPptkNpdNpdIdIndexImport.update({
    id: '/pptk/npd/$npdId/',
    path: '/pptk/npd/$npdId/',
    getParentRoute: () => AuthenticatedPptkLayoutRouteRoute,
  } as any)

const AuthenticatedPptkLayoutPptkLaporanLpjIndexRoute =
  AuthenticatedPptkLayoutPptkLaporanLpjIndexImport.update({
    id: '/lpj/',
    path: '/lpj/',
    getParentRoute: () => AuthenticatedPptkLayoutPptkLaporanRouteRoute,
  } as any)

const AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdIndexRoute =
  AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdIndexImport.update({
    id: '/anggaran/$anggaranId/',
    path: '/anggaran/$anggaranId/',
    getParentRoute: () => AuthenticatedPptkLayoutPptkPlafonRouteRoute,
  } as any)

const AuthenticatedPptkLayoutPptkNpdNpdIdPdfIndexRoute =
  AuthenticatedPptkLayoutPptkNpdNpdIdPdfIndexImport.update({
    id: '/pptk/npd/$npdId/pdf/',
    path: '/pptk/npd/$npdId/pdf/',
    getParentRoute: () => AuthenticatedPptkLayoutRouteRoute,
  } as any)

const AuthenticatedPptkLayoutPptkLaporanLpjPdfIndexRoute =
  AuthenticatedPptkLayoutPptkLaporanLpjPdfIndexImport.update({
    id: '/lpj/pdf/',
    path: '/lpj/pdf/',
    getParentRoute: () => AuthenticatedPptkLayoutPptkLaporanRouteRoute,
  } as any)

const AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRoute =
  AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteImport.update(
    {
      id: '/anggaran/$anggaranId/sub-kegiatan',
      path: '/anggaran/$anggaranId/sub-kegiatan',
      getParentRoute: () => AuthenticatedPptkLayoutPptkPlafonRouteRoute,
    } as any,
  )

const AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdIndexRoute =
  AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdIndexImport.update(
    {
      id: '/$subKegiatanId/',
      path: '/$subKegiatanId/',
      getParentRoute: () =>
        AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRoute,
    } as any,
  )

const AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRoute =
  AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteImport.update(
    {
      id: '/$subKegiatanId/rekening',
      path: '/$subKegiatanId/rekening',
      getParentRoute: () =>
        AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRoute,
    } as any,
  )

const AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRekeningIdIndexRoute =
  AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRekeningIdIndexImport.update(
    {
      id: '/$rekeningId/',
      path: '/$rekeningId/',
      getParentRoute: () =>
        AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRoute,
    } as any,
  )

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedRouteImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/_pptkLayout': {
      id: '/_authenticated/_pptkLayout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedPptkLayoutRouteImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/_superadmin': {
      id: '/_authenticated/_superadmin'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedSuperadminRouteImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/(auth)/login': {
      id: '/(auth)/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof authLoginImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/_pptkLayout/pptk/laporan': {
      id: '/_authenticated/_pptkLayout/pptk/laporan'
      path: '/pptk/laporan'
      fullPath: '/pptk/laporan'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkLaporanRouteImport
      parentRoute: typeof AuthenticatedPptkLayoutRouteImport
    }
    '/_authenticated/_pptkLayout/pptk/plafon': {
      id: '/_authenticated/_pptkLayout/pptk/plafon'
      path: '/pptk/plafon'
      fullPath: '/pptk/plafon'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkPlafonRouteImport
      parentRoute: typeof AuthenticatedPptkLayoutRouteImport
    }
    '/_authenticated/_pptkLayout/pptk/': {
      id: '/_authenticated/_pptkLayout/pptk/'
      path: '/pptk'
      fullPath: '/pptk'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkIndexImport
      parentRoute: typeof AuthenticatedPptkLayoutRouteImport
    }
    '/_authenticated/_superadmin/superadmin/': {
      id: '/_authenticated/_superadmin/superadmin/'
      path: '/superadmin'
      fullPath: '/superadmin'
      preLoaderRoute: typeof AuthenticatedSuperadminSuperadminIndexImport
      parentRoute: typeof AuthenticatedSuperadminRouteImport
    }
    '/_authenticated/_pptkLayout/pptk/npd/': {
      id: '/_authenticated/_pptkLayout/pptk/npd/'
      path: '/pptk/npd'
      fullPath: '/pptk/npd'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkNpdIndexImport
      parentRoute: typeof AuthenticatedPptkLayoutRouteImport
    }
    '/_authenticated/_superadmin/superadmin/akun/': {
      id: '/_authenticated/_superadmin/superadmin/akun/'
      path: '/superadmin/akun'
      fullPath: '/superadmin/akun'
      preLoaderRoute: typeof AuthenticatedSuperadminSuperadminAkunIndexImport
      parentRoute: typeof AuthenticatedSuperadminRouteImport
    }
    '/_authenticated/_pptkLayout/pptk/laporan/lpj/': {
      id: '/_authenticated/_pptkLayout/pptk/laporan/lpj/'
      path: '/lpj'
      fullPath: '/pptk/laporan/lpj'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkLaporanLpjIndexImport
      parentRoute: typeof AuthenticatedPptkLayoutPptkLaporanRouteImport
    }
    '/_authenticated/_pptkLayout/pptk/npd/$npdId/': {
      id: '/_authenticated/_pptkLayout/pptk/npd/$npdId/'
      path: '/pptk/npd/$npdId'
      fullPath: '/pptk/npd/$npdId'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkNpdNpdIdIndexImport
      parentRoute: typeof AuthenticatedPptkLayoutRouteImport
    }
    '/_authenticated/_pptkLayout/pptk/plafon/anggaran/': {
      id: '/_authenticated/_pptkLayout/pptk/plafon/anggaran/'
      path: '/anggaran'
      fullPath: '/pptk/plafon/anggaran'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranIndexImport
      parentRoute: typeof AuthenticatedPptkLayoutPptkPlafonRouteImport
    }
    '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan': {
      id: '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan'
      path: '/anggaran/$anggaranId/sub-kegiatan'
      fullPath: '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteImport
      parentRoute: typeof AuthenticatedPptkLayoutPptkPlafonRouteImport
    }
    '/_authenticated/_pptkLayout/pptk/laporan/lpj/pdf/': {
      id: '/_authenticated/_pptkLayout/pptk/laporan/lpj/pdf/'
      path: '/lpj/pdf'
      fullPath: '/pptk/laporan/lpj/pdf'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkLaporanLpjPdfIndexImport
      parentRoute: typeof AuthenticatedPptkLayoutPptkLaporanRouteImport
    }
    '/_authenticated/_pptkLayout/pptk/npd/$npdId/pdf/': {
      id: '/_authenticated/_pptkLayout/pptk/npd/$npdId/pdf/'
      path: '/pptk/npd/$npdId/pdf'
      fullPath: '/pptk/npd/$npdId/pdf'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkNpdNpdIdPdfIndexImport
      parentRoute: typeof AuthenticatedPptkLayoutRouteImport
    }
    '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/': {
      id: '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/'
      path: '/anggaran/$anggaranId'
      fullPath: '/pptk/plafon/anggaran/$anggaranId'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdIndexImport
      parentRoute: typeof AuthenticatedPptkLayoutPptkPlafonRouteImport
    }
    '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening': {
      id: '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening'
      path: '/$subKegiatanId/rekening'
      fullPath: '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteImport
      parentRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteImport
    }
    '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/': {
      id: '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/'
      path: '/$subKegiatanId'
      fullPath: '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdIndexImport
      parentRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteImport
    }
    '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId/': {
      id: '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId/'
      path: '/$rekeningId'
      fullPath: '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId'
      preLoaderRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRekeningIdIndexImport
      parentRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedPptkLayoutPptkLaporanRouteRouteChildren {
  AuthenticatedPptkLayoutPptkLaporanLpjIndexRoute: typeof AuthenticatedPptkLayoutPptkLaporanLpjIndexRoute
  AuthenticatedPptkLayoutPptkLaporanLpjPdfIndexRoute: typeof AuthenticatedPptkLayoutPptkLaporanLpjPdfIndexRoute
}

const AuthenticatedPptkLayoutPptkLaporanRouteRouteChildren: AuthenticatedPptkLayoutPptkLaporanRouteRouteChildren =
  {
    AuthenticatedPptkLayoutPptkLaporanLpjIndexRoute:
      AuthenticatedPptkLayoutPptkLaporanLpjIndexRoute,
    AuthenticatedPptkLayoutPptkLaporanLpjPdfIndexRoute:
      AuthenticatedPptkLayoutPptkLaporanLpjPdfIndexRoute,
  }

const AuthenticatedPptkLayoutPptkLaporanRouteRouteWithChildren =
  AuthenticatedPptkLayoutPptkLaporanRouteRoute._addFileChildren(
    AuthenticatedPptkLayoutPptkLaporanRouteRouteChildren,
  )

interface AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRouteChildren {
  AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRekeningIdIndexRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRekeningIdIndexRoute
}

const AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRouteChildren: AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRouteChildren =
  {
    AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRekeningIdIndexRoute:
      AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRekeningIdIndexRoute,
  }

const AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRouteWithChildren =
  AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRoute._addFileChildren(
    AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRouteChildren,
  )

interface AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRouteChildren {
  AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRouteWithChildren
  AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdIndexRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdIndexRoute
}

const AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRouteChildren: AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRouteChildren =
  {
    AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRoute:
      AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRouteWithChildren,
    AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdIndexRoute:
      AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdIndexRoute,
  }

const AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRouteWithChildren =
  AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRoute._addFileChildren(
    AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRouteChildren,
  )

interface AuthenticatedPptkLayoutPptkPlafonRouteRouteChildren {
  AuthenticatedPptkLayoutPptkPlafonAnggaranIndexRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranIndexRoute
  AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRouteWithChildren
  AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdIndexRoute: typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdIndexRoute
}

const AuthenticatedPptkLayoutPptkPlafonRouteRouteChildren: AuthenticatedPptkLayoutPptkPlafonRouteRouteChildren =
  {
    AuthenticatedPptkLayoutPptkPlafonAnggaranIndexRoute:
      AuthenticatedPptkLayoutPptkPlafonAnggaranIndexRoute,
    AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRoute:
      AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRouteWithChildren,
    AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdIndexRoute:
      AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdIndexRoute,
  }

const AuthenticatedPptkLayoutPptkPlafonRouteRouteWithChildren =
  AuthenticatedPptkLayoutPptkPlafonRouteRoute._addFileChildren(
    AuthenticatedPptkLayoutPptkPlafonRouteRouteChildren,
  )

interface AuthenticatedPptkLayoutRouteRouteChildren {
  AuthenticatedPptkLayoutPptkLaporanRouteRoute: typeof AuthenticatedPptkLayoutPptkLaporanRouteRouteWithChildren
  AuthenticatedPptkLayoutPptkPlafonRouteRoute: typeof AuthenticatedPptkLayoutPptkPlafonRouteRouteWithChildren
  AuthenticatedPptkLayoutPptkIndexRoute: typeof AuthenticatedPptkLayoutPptkIndexRoute
  AuthenticatedPptkLayoutPptkNpdIndexRoute: typeof AuthenticatedPptkLayoutPptkNpdIndexRoute
  AuthenticatedPptkLayoutPptkNpdNpdIdIndexRoute: typeof AuthenticatedPptkLayoutPptkNpdNpdIdIndexRoute
  AuthenticatedPptkLayoutPptkNpdNpdIdPdfIndexRoute: typeof AuthenticatedPptkLayoutPptkNpdNpdIdPdfIndexRoute
}

const AuthenticatedPptkLayoutRouteRouteChildren: AuthenticatedPptkLayoutRouteRouteChildren =
  {
    AuthenticatedPptkLayoutPptkLaporanRouteRoute:
      AuthenticatedPptkLayoutPptkLaporanRouteRouteWithChildren,
    AuthenticatedPptkLayoutPptkPlafonRouteRoute:
      AuthenticatedPptkLayoutPptkPlafonRouteRouteWithChildren,
    AuthenticatedPptkLayoutPptkIndexRoute:
      AuthenticatedPptkLayoutPptkIndexRoute,
    AuthenticatedPptkLayoutPptkNpdIndexRoute:
      AuthenticatedPptkLayoutPptkNpdIndexRoute,
    AuthenticatedPptkLayoutPptkNpdNpdIdIndexRoute:
      AuthenticatedPptkLayoutPptkNpdNpdIdIndexRoute,
    AuthenticatedPptkLayoutPptkNpdNpdIdPdfIndexRoute:
      AuthenticatedPptkLayoutPptkNpdNpdIdPdfIndexRoute,
  }

const AuthenticatedPptkLayoutRouteRouteWithChildren =
  AuthenticatedPptkLayoutRouteRoute._addFileChildren(
    AuthenticatedPptkLayoutRouteRouteChildren,
  )

interface AuthenticatedSuperadminRouteRouteChildren {
  AuthenticatedSuperadminSuperadminIndexRoute: typeof AuthenticatedSuperadminSuperadminIndexRoute
  AuthenticatedSuperadminSuperadminAkunIndexRoute: typeof AuthenticatedSuperadminSuperadminAkunIndexRoute
}

const AuthenticatedSuperadminRouteRouteChildren: AuthenticatedSuperadminRouteRouteChildren =
  {
    AuthenticatedSuperadminSuperadminIndexRoute:
      AuthenticatedSuperadminSuperadminIndexRoute,
    AuthenticatedSuperadminSuperadminAkunIndexRoute:
      AuthenticatedSuperadminSuperadminAkunIndexRoute,
  }

const AuthenticatedSuperadminRouteRouteWithChildren =
  AuthenticatedSuperadminRouteRoute._addFileChildren(
    AuthenticatedSuperadminRouteRouteChildren,
  )

interface AuthenticatedRouteRouteChildren {
  AuthenticatedPptkLayoutRouteRoute: typeof AuthenticatedPptkLayoutRouteRouteWithChildren
  AuthenticatedSuperadminRouteRoute: typeof AuthenticatedSuperadminRouteRouteWithChildren
}

const AuthenticatedRouteRouteChildren: AuthenticatedRouteRouteChildren = {
  AuthenticatedPptkLayoutRouteRoute:
    AuthenticatedPptkLayoutRouteRouteWithChildren,
  AuthenticatedSuperadminRouteRoute:
    AuthenticatedSuperadminRouteRouteWithChildren,
}

const AuthenticatedRouteRouteWithChildren =
  AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof AuthenticatedSuperadminRouteRouteWithChildren
  '/login': typeof authLoginRoute
  '/pptk/laporan': typeof AuthenticatedPptkLayoutPptkLaporanRouteRouteWithChildren
  '/pptk/plafon': typeof AuthenticatedPptkLayoutPptkPlafonRouteRouteWithChildren
  '/pptk': typeof AuthenticatedPptkLayoutPptkIndexRoute
  '/superadmin': typeof AuthenticatedSuperadminSuperadminIndexRoute
  '/pptk/npd': typeof AuthenticatedPptkLayoutPptkNpdIndexRoute
  '/superadmin/akun': typeof AuthenticatedSuperadminSuperadminAkunIndexRoute
  '/pptk/laporan/lpj': typeof AuthenticatedPptkLayoutPptkLaporanLpjIndexRoute
  '/pptk/npd/$npdId': typeof AuthenticatedPptkLayoutPptkNpdNpdIdIndexRoute
  '/pptk/plafon/anggaran': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranIndexRoute
  '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRouteWithChildren
  '/pptk/laporan/lpj/pdf': typeof AuthenticatedPptkLayoutPptkLaporanLpjPdfIndexRoute
  '/pptk/npd/$npdId/pdf': typeof AuthenticatedPptkLayoutPptkNpdNpdIdPdfIndexRoute
  '/pptk/plafon/anggaran/$anggaranId': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdIndexRoute
  '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRouteWithChildren
  '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdIndexRoute
  '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRekeningIdIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof AuthenticatedSuperadminRouteRouteWithChildren
  '/login': typeof authLoginRoute
  '/pptk/laporan': typeof AuthenticatedPptkLayoutPptkLaporanRouteRouteWithChildren
  '/pptk/plafon': typeof AuthenticatedPptkLayoutPptkPlafonRouteRouteWithChildren
  '/pptk': typeof AuthenticatedPptkLayoutPptkIndexRoute
  '/superadmin': typeof AuthenticatedSuperadminSuperadminIndexRoute
  '/pptk/npd': typeof AuthenticatedPptkLayoutPptkNpdIndexRoute
  '/superadmin/akun': typeof AuthenticatedSuperadminSuperadminAkunIndexRoute
  '/pptk/laporan/lpj': typeof AuthenticatedPptkLayoutPptkLaporanLpjIndexRoute
  '/pptk/npd/$npdId': typeof AuthenticatedPptkLayoutPptkNpdNpdIdIndexRoute
  '/pptk/plafon/anggaran': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranIndexRoute
  '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRouteWithChildren
  '/pptk/laporan/lpj/pdf': typeof AuthenticatedPptkLayoutPptkLaporanLpjPdfIndexRoute
  '/pptk/npd/$npdId/pdf': typeof AuthenticatedPptkLayoutPptkNpdNpdIdPdfIndexRoute
  '/pptk/plafon/anggaran/$anggaranId': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdIndexRoute
  '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRouteWithChildren
  '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdIndexRoute
  '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRekeningIdIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_authenticated': typeof AuthenticatedRouteRouteWithChildren
  '/_authenticated/_pptkLayout': typeof AuthenticatedPptkLayoutRouteRouteWithChildren
  '/_authenticated/_superadmin': typeof AuthenticatedSuperadminRouteRouteWithChildren
  '/(auth)/login': typeof authLoginRoute
  '/_authenticated/_pptkLayout/pptk/laporan': typeof AuthenticatedPptkLayoutPptkLaporanRouteRouteWithChildren
  '/_authenticated/_pptkLayout/pptk/plafon': typeof AuthenticatedPptkLayoutPptkPlafonRouteRouteWithChildren
  '/_authenticated/_pptkLayout/pptk/': typeof AuthenticatedPptkLayoutPptkIndexRoute
  '/_authenticated/_superadmin/superadmin/': typeof AuthenticatedSuperadminSuperadminIndexRoute
  '/_authenticated/_pptkLayout/pptk/npd/': typeof AuthenticatedPptkLayoutPptkNpdIndexRoute
  '/_authenticated/_superadmin/superadmin/akun/': typeof AuthenticatedSuperadminSuperadminAkunIndexRoute
  '/_authenticated/_pptkLayout/pptk/laporan/lpj/': typeof AuthenticatedPptkLayoutPptkLaporanLpjIndexRoute
  '/_authenticated/_pptkLayout/pptk/npd/$npdId/': typeof AuthenticatedPptkLayoutPptkNpdNpdIdIndexRoute
  '/_authenticated/_pptkLayout/pptk/plafon/anggaran/': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranIndexRoute
  '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanRouteRouteWithChildren
  '/_authenticated/_pptkLayout/pptk/laporan/lpj/pdf/': typeof AuthenticatedPptkLayoutPptkLaporanLpjPdfIndexRoute
  '/_authenticated/_pptkLayout/pptk/npd/$npdId/pdf/': typeof AuthenticatedPptkLayoutPptkNpdNpdIdPdfIndexRoute
  '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdIndexRoute
  '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRouteRouteWithChildren
  '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdIndexRoute
  '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId/': typeof AuthenticatedPptkLayoutPptkPlafonAnggaranAnggaranIdSubKegiatanSubKegiatanIdRekeningRekeningIdIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | ''
    | '/login'
    | '/pptk/laporan'
    | '/pptk/plafon'
    | '/pptk'
    | '/superadmin'
    | '/pptk/npd'
    | '/superadmin/akun'
    | '/pptk/laporan/lpj'
    | '/pptk/npd/$npdId'
    | '/pptk/plafon/anggaran'
    | '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan'
    | '/pptk/laporan/lpj/pdf'
    | '/pptk/npd/$npdId/pdf'
    | '/pptk/plafon/anggaran/$anggaranId'
    | '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening'
    | '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId'
    | '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | ''
    | '/login'
    | '/pptk/laporan'
    | '/pptk/plafon'
    | '/pptk'
    | '/superadmin'
    | '/pptk/npd'
    | '/superadmin/akun'
    | '/pptk/laporan/lpj'
    | '/pptk/npd/$npdId'
    | '/pptk/plafon/anggaran'
    | '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan'
    | '/pptk/laporan/lpj/pdf'
    | '/pptk/npd/$npdId/pdf'
    | '/pptk/plafon/anggaran/$anggaranId'
    | '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening'
    | '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId'
    | '/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId'
  id:
    | '__root__'
    | '/'
    | '/_authenticated'
    | '/_authenticated/_pptkLayout'
    | '/_authenticated/_superadmin'
    | '/(auth)/login'
    | '/_authenticated/_pptkLayout/pptk/laporan'
    | '/_authenticated/_pptkLayout/pptk/plafon'
    | '/_authenticated/_pptkLayout/pptk/'
    | '/_authenticated/_superadmin/superadmin/'
    | '/_authenticated/_pptkLayout/pptk/npd/'
    | '/_authenticated/_superadmin/superadmin/akun/'
    | '/_authenticated/_pptkLayout/pptk/laporan/lpj/'
    | '/_authenticated/_pptkLayout/pptk/npd/$npdId/'
    | '/_authenticated/_pptkLayout/pptk/plafon/anggaran/'
    | '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan'
    | '/_authenticated/_pptkLayout/pptk/laporan/lpj/pdf/'
    | '/_authenticated/_pptkLayout/pptk/npd/$npdId/pdf/'
    | '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/'
    | '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening'
    | '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/'
    | '/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthenticatedRouteRoute: typeof AuthenticatedRouteRouteWithChildren
  authLoginRoute: typeof authLoginRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  authLoginRoute: authLoginRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_authenticated",
        "/(auth)/login"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_authenticated": {
      "filePath": "_authenticated/route.tsx",
      "children": [
        "/_authenticated/_pptkLayout",
        "/_authenticated/_superadmin"
      ]
    },
    "/_authenticated/_pptkLayout": {
      "filePath": "_authenticated/_pptkLayout/route.tsx",
      "parent": "/_authenticated",
      "children": [
        "/_authenticated/_pptkLayout/pptk/laporan",
        "/_authenticated/_pptkLayout/pptk/plafon",
        "/_authenticated/_pptkLayout/pptk/",
        "/_authenticated/_pptkLayout/pptk/npd/",
        "/_authenticated/_pptkLayout/pptk/npd/$npdId/",
        "/_authenticated/_pptkLayout/pptk/npd/$npdId/pdf/"
      ]
    },
    "/_authenticated/_superadmin": {
      "filePath": "_authenticated/_superadmin/route.tsx",
      "parent": "/_authenticated",
      "children": [
        "/_authenticated/_superadmin/superadmin/",
        "/_authenticated/_superadmin/superadmin/akun/"
      ]
    },
    "/(auth)/login": {
      "filePath": "(auth)/login.tsx"
    },
    "/_authenticated/_pptkLayout/pptk/laporan": {
      "filePath": "_authenticated/_pptkLayout/pptk/laporan/route.tsx",
      "parent": "/_authenticated/_pptkLayout",
      "children": [
        "/_authenticated/_pptkLayout/pptk/laporan/lpj/",
        "/_authenticated/_pptkLayout/pptk/laporan/lpj/pdf/"
      ]
    },
    "/_authenticated/_pptkLayout/pptk/plafon": {
      "filePath": "_authenticated/_pptkLayout/pptk/plafon/route.tsx",
      "parent": "/_authenticated/_pptkLayout",
      "children": [
        "/_authenticated/_pptkLayout/pptk/plafon/anggaran/",
        "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan",
        "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/"
      ]
    },
    "/_authenticated/_pptkLayout/pptk/": {
      "filePath": "_authenticated/_pptkLayout/pptk/index.tsx",
      "parent": "/_authenticated/_pptkLayout"
    },
    "/_authenticated/_superadmin/superadmin/": {
      "filePath": "_authenticated/_superadmin/superadmin/index.tsx",
      "parent": "/_authenticated/_superadmin"
    },
    "/_authenticated/_pptkLayout/pptk/npd/": {
      "filePath": "_authenticated/_pptkLayout/pptk/npd/index.tsx",
      "parent": "/_authenticated/_pptkLayout"
    },
    "/_authenticated/_superadmin/superadmin/akun/": {
      "filePath": "_authenticated/_superadmin/superadmin/akun/index.tsx",
      "parent": "/_authenticated/_superadmin"
    },
    "/_authenticated/_pptkLayout/pptk/laporan/lpj/": {
      "filePath": "_authenticated/_pptkLayout/pptk/laporan/lpj/index.tsx",
      "parent": "/_authenticated/_pptkLayout/pptk/laporan"
    },
    "/_authenticated/_pptkLayout/pptk/npd/$npdId/": {
      "filePath": "_authenticated/_pptkLayout/pptk/npd/$npdId/index.tsx",
      "parent": "/_authenticated/_pptkLayout"
    },
    "/_authenticated/_pptkLayout/pptk/plafon/anggaran/": {
      "filePath": "_authenticated/_pptkLayout/pptk/plafon/anggaran/index.tsx",
      "parent": "/_authenticated/_pptkLayout/pptk/plafon"
    },
    "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan": {
      "filePath": "_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/route.tsx",
      "parent": "/_authenticated/_pptkLayout/pptk/plafon",
      "children": [
        "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening",
        "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/"
      ]
    },
    "/_authenticated/_pptkLayout/pptk/laporan/lpj/pdf/": {
      "filePath": "_authenticated/_pptkLayout/pptk/laporan/lpj/pdf/index.tsx",
      "parent": "/_authenticated/_pptkLayout/pptk/laporan"
    },
    "/_authenticated/_pptkLayout/pptk/npd/$npdId/pdf/": {
      "filePath": "_authenticated/_pptkLayout/pptk/npd/$npdId/pdf/index.tsx",
      "parent": "/_authenticated/_pptkLayout"
    },
    "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/": {
      "filePath": "_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/index.tsx",
      "parent": "/_authenticated/_pptkLayout/pptk/plafon"
    },
    "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening": {
      "filePath": "_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/route.tsx",
      "parent": "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan",
      "children": [
        "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId/"
      ]
    },
    "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/": {
      "filePath": "_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/index.tsx",
      "parent": "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan"
    },
    "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId/": {
      "filePath": "_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening/$rekeningId/index.tsx",
      "parent": "/_authenticated/_pptkLayout/pptk/plafon/anggaran/$anggaranId/sub-kegiatan/$subKegiatanId/rekening"
    }
  }
}
ROUTE_MANIFEST_END */
