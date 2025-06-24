const PPTKBreadcrumb = {
  anggaran: {
    kegiatan: [
      {
        title: "Dashboard",
        href: "/pptk",
      },
      {
        title: "Plafon",
        subtitle: "Plafon",
        items: [
          {
            title: "Anggaran",
            href: "/pptk/plafon/anggaran",
          },
          {
            title: "SPD",
            href: "/pptk/plafon/spd",
          },
        ],
      },
      {
        title: "Anggaran",
      },
    ],
    "sub-kegiatan": [
      {
        title: "Dashboard",
        href: "/pptk",
      },
      {
        title: "Plafon",
        subtitle: "Plafon",
        items: [
          {
            title: "Anggaran",
            href: "/pptk/plafon/anggaran",
          },
          {
            title: "SPD",
            href: "/pptk/plafon/spd",
          },
        ],
      },
      {
        title: "Anggaran",
        href: `/pptk/plafon/anggaran`,
      },
      {
        title: "Sub Kegiatan",
      },
    ],
    rekening: (anggaranId: string) => [
      {
        title: "Dashboard",
        href: "/pptk",
      },
      {
        title: "Plafon",
        subtitle: "Plafon",
        items: [
          {
            title: "Anggaran",
            href: "/pptk/plafon/anggaran",
          },
          {
            title: "SPD",
            href: "/pptk/plafon/spd",
          },
        ],
      },
      {
        title: "Anggaran",
        href: `/pptk/plafon/anggaran`,
      },
      {
        title: "Sub Kegiatan",
        href: `/pptk/plafon/anggaran/${anggaranId}`,
      },
      {
        title: "Rekening",
      },
    ],
    rincianObjek: (anggaranId: string, subKegiatanId: string) => [
      {
        title: "Dashboard",
        href: "/pptk",
      },
      {
        title: "Plafon",
        subtitle: "Plafon",
        items: [
          {
            title: "Anggaran",
            href: "/pptk/plafon/anggaran",
          },
          {
            title: "SPD",
            href: "/pptk/plafon/spd",
          },
        ],
      },
      {
        title: "Anggaran",
        href: `/pptk/plafon/anggaran`,
      },
      {
        title: "Sub Kegiatan",
        href: `/pptk/plafon/anggaran/${anggaranId}`,
      },
      {
        title: "Rekening",
        href: `/pptk/plafon/anggaran/${anggaranId}/sub-kegiatan/${subKegiatanId}`,
      },
      {
        title: "Rincian Objek",
      },
    ],
  },
  npd: {
    list: [
      {
        title: "Dashboard",
        href: "/pptk",
      },
      {
        title: "NPD",
      },
    ],
    rincian: [
      {
        title: "Dashboard",
        href: "/pptk",
      },
      {
        title: "NPD",
        href: "/pptk/npd",
      },
      {
        title: "Rincian NPD",
      },
    ],
    pdf: (npdId: string) => [
      {
        title: "Dashboard",
        href: "/pptk",
      },
      {
        title: "NPD",
        href: "/pptk/npd",
      },
      {
        title: "Rincian NPD",
        href: `/pptk/npd/${npdId}`,
      },
      {
        title: "Unduh PDF",
      },
    ],
  },
  laporan: {
    "lpj-page": [
      {
        title: "Dashboard",
        href: "/pptk",
      },
      {
        title: "Laporan",
        subtitle: "Laporan",
        items: [
          {
            title: "LPJ",
            href: "/pptk/laporan/lpj",
          },
        ],
      },
      {
        title: "Laporan LPJ",
      },
    ],
    "lpj-pdf": [
      {
        title: "Dashboard",
        href: "/pptk",
      },
      {
        title: "Laporan",
        subtitle: "Laporan",
        items: [
          {
            title: "LPJ",
            href: "/pptk/laporan/lpj",
          },
        ],
      },
      {
        title: "Laporan LPJ",
        href: "/pptk/laporan/lpj/",
      },
      {
        title: "Unduh PDF LPJ",
      },
    ],
  },
};

const SuperadminBreadcrumb = {
  akun: [
    {
      title: "Dashboard",
      href: "/superadmin",
    },
    {
      title: "Akun",
      subtitle: "Akun",
    },
  ],
};

export { PPTKBreadcrumb, SuperadminBreadcrumb };
