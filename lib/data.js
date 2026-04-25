// Venus Gecko — sample data (refined Bottega-tinged catalog)
window.VG_GECKOS = [
  {
    id: "VG-001", name: "Obsidian", nameKr: "옵시디언",
    genetics: ["Super Sable", "Lilly White"], sex: "M", size: "Adult",
    birth: "2023-05-15", weight: 52, price: 780000,
    sire: "P-001", dam: "P-002",
    status: "available", featured: true,
    tags: ["high pattern", "dark base"],
    desc: { ko: "진한 먹색 바탕에 릴리 패턴이 또렷한 성체 수컷. 번식 전용으로 권장.", en: "A dark-based Super Sable Lilly White male with pronounced pattern. Breeder-grade." }
  },
  {
    id: "VG-002", name: "Tabacco", nameKr: "타바코",
    genetics: ["Lilly Azantic"], sex: "F", size: "Subadult",
    birth: "2024-02-20", weight: 24, price: 620000,
    sire: "P-003", dam: "P-004",
    status: "available", featured: true,
    tags: ["fire dal", "clean dorsal"],
    desc: { ko: "안정적인 펌프킨 톤에 릴리 패턴이 고르게 발현된 준성체 암컷.", en: "A Lilly Azantic subadult female with clean pumpkin tone and even pattern." }
  },
  {
    id: "VG-003", name: "Ochre", nameKr: "오커",
    genetics: ["Cappuccino", "Luwak"], sex: "M", size: "Baby",
    birth: "2024-08-10", weight: 6, price: 320000,
    sire: "P-001", dam: "P-005",
    status: "available", featured: false,
    tags: ["patternless"],
    desc: { ko: "루왁 유전자가 섞인 깊은 커피 톤 베이비.", en: "Cappuccino Luwak baby with deep coffee tonality." }
  },
  {
    id: "VG-004", name: "Noir", nameKr: "누아르",
    genetics: ["Super Sable Lilly", "Hypo"], sex: "M", size: "Adult",
    birth: "2022-11-05", weight: 58, price: 1250000,
    sire: "P-003", dam: "P-002",
    status: "reserved", featured: true,
    tags: ["showcase", "holdback"],
    desc: { ko: "최상급 수컷. 계보 전체 기록 열람 가능.", en: "Top-tier male. Full lineage documentation available." }
  },
  {
    id: "VG-005", name: "Prugna", nameKr: "프루냐",
    genetics: ["Lilly ChoCho", "50% Het Azantic"], sex: "F", size: "Subadult",
    birth: "2024-03-15", weight: 22, price: 580000,
    sire: "P-006", dam: "P-004",
    status: "available", featured: true,
    tags: ["het carrier"],
    desc: { ko: "희귀 조합의 암컷. 번식 라인으로 적합.", en: "Rare combination female. Suitable for breeding programs." }
  },
  {
    id: "VG-006", name: "Pollini", nameKr: "폴리니",
    genetics: ["Frappuccino"], sex: "U", size: "Baby",
    birth: "2024-09-01", weight: 5, price: 240000,
    sire: "P-001", dam: "P-005",
    status: "available", featured: false,
    tags: ["unsexed"],
    desc: { ko: "프라푸치노 베이비. 성별 미감별.", en: "Frappuccino baby. Sex not yet determined." }
  },
  {
    id: "VG-007", name: "Crema", nameKr: "크레마",
    genetics: ["Lilly White", "100% Het Azantic"], sex: "F", size: "Adult",
    birth: "2023-01-20", weight: 48, price: 890000,
    sire: "P-003", dam: "P-007",
    status: "available", featured: true,
    tags: ["het carrier", "breeder-grade"],
    desc: { ko: "번식 프로그램에 최적인 릴리 화이트 100% 헷 아잔틱 암컷.", en: "Premium Lilly White 100% Het Azantic female for breeding programs." }
  },
  {
    id: "VG-008", name: "Bronzo", nameKr: "브론조",
    genetics: ["Sable", "Luwak Lilly"], sex: "M", size: "Adult",
    birth: "2022-08-30", weight: 62, price: 720000,
    sire: "P-008", dam: "P-002",
    status: "sold", featured: false,
    tags: ["archive"],
    desc: { ko: "대형 체형의 수컷. 분양 완료.", en: "Large-bodied male. Sold." }
  },
  {
    id: "VG-009", name: "Ambra", nameKr: "암브라",
    genetics: ["Cappuccino", "Lilly White"], sex: "F", size: "Subadult",
    birth: "2024-04-18", weight: 20, price: 540000,
    sire: "P-001", dam: "P-007",
    status: "available", featured: false,
    tags: ["fresh"],
    desc: { ko: "카푸치노 × 릴리화이트 암컷. 톤이 고르게 발현.", en: "Cappuccino × Lilly White female with even tonal expression." }
  }
];

window.VG_PARENTS = [
  // Generation 1 — direct parents
  { id: "P-001", name: "Thor", nameKr: "토르", genetics: ["Super Sable"], sex: "M", birth: "2021-03-10", weight: 68,
    origin: "AC Reptiles (USA)", acquired: "2021-09-01",
    sire: "PG-101", dam: "PG-102",
    desc: { ko: "라인의 메인 수컷. 안정적인 색상 전이.", en: "Foundational male. Reliable color transmission." },
    offspring: ["VG-001","VG-003","VG-006"] },
  { id: "P-002", name: "Freya", nameKr: "프레야", genetics: ["Lilly White", "Hypo"], sex: "F", birth: "2020-11-20", weight: 54,
    origin: "Allen Repashy Line", acquired: "2021-02-12",
    sire: "PG-103", dam: "PG-104",
    desc: { ko: "일관된 클러치를 생산하는 릴리 화이트 암컷.", en: "Lilly White female with consistent clutches." },
    offspring: ["VG-001","VG-004","VG-008"] },
  { id: "P-003", name: "Zeus", nameKr: "제우스", genetics: ["Azantic","Super Sable"], sex: "M", birth: "2020-05-15", weight: 72,
    origin: "Northern Gecko", acquired: "2020-12-04",
    sire: "PG-105", dam: "PG-106",
    desc: { ko: "아잔틱 라인의 대표 수컷.", en: "Flagship male of our Azantic line." },
    offspring: ["VG-002","VG-004","VG-007"] },
  { id: "P-004", name: "Athena", nameKr: "아테나", genetics: ["Lilly Azantic"], sex: "F", birth: "2021-01-08", weight: 49,
    origin: "Private Breeder (KR)", acquired: "2022-03-20",
    // 조부모 정보 없음 (수입 시 미동봉) — 트리에서 'Unknown' 표시
    desc: { ko: "선명한 발색을 전달.", en: "Passes vivid coloration to offspring." },
    offspring: ["VG-002","VG-005"] },
  { id: "P-005", name: "Hera", nameKr: "헤라", genetics: ["Cappuccino","Luwak"], sex: "F", birth: "2021-07-22", weight: 51,
    origin: "Pangea Reptile", acquired: "2022-05-14",
    sire: "PG-107", dam: "PG-108",
    desc: { ko: "건강한 클러치를 꾸준히 생산.", en: "Consistently healthy clutches." },
    offspring: ["VG-003","VG-006","VG-009"] },
  { id: "P-006", name: "Apollo", nameKr: "아폴로", genetics: ["Lilly ChoCho","100% Het Azantic"], sex: "M", birth: "2020-09-12", weight: 65,
    origin: "LLL Reptile", acquired: "2021-06-18",
    sire: "PG-105", // shared with Zeus — 같은 부계
    desc: { ko: "헷 아잔틱 캐리어 수컷.", en: "Het Azantic carrier male." },
    offspring: ["VG-005"] },
  { id: "P-007", name: "Artemis", nameKr: "아르테미스", genetics: ["Lilly White","100% Het Azantic"], sex: "F", birth: "2020-12-05", weight: 50,
    origin: "Northern Gecko", acquired: "2021-08-22",
    sire: "PG-109", dam: "PG-110",
    desc: { ko: "우수한 번식 라인.", en: "Excellent breeding line." },
    offspring: ["VG-007","VG-009"] },
  { id: "P-008", name: "Odin", nameKr: "오딘", genetics: ["Sable","Luwak Lilly"], sex: "M", birth: "2019-08-18", weight: 76,
    origin: "AC Reptiles (USA)", acquired: "2020-01-05",
    desc: { ko: "대형 체형을 전달하는 수컷.", en: "Male passing large-body genetics." },
    offspring: ["VG-008"] },

  // Generation 2 — grandparents (info only, not for sale)
  { id: "PG-101", name: "Sable Sr.", nameKr: "세이블 시니어", genetics: ["Sable"], sex: "M", birth: "2018-04-10",
    origin: "AC Reptiles (USA)", acquired: "—",
    sire: "PGG-201", dam: "PGG-202",
    desc: { ko: "토르의 부친. 라인 시발점.", en: "Sire of Thor. Line origin." }, offspring: ["P-001"] },
  { id: "PG-102", name: "Lilly G1", nameKr: "릴리 G1", genetics: ["Lilly White"], sex: "F", birth: "2018-06-22",
    origin: "AC Reptiles (USA)", acquired: "—",
    desc: { ko: "토르의 모친.", en: "Dam of Thor." }, offspring: ["P-001"] },
  { id: "PG-103", name: "Patternless Sire", nameKr: "패턴리스 시니어", genetics: ["Patternless"], sex: "M", birth: "2017-03-05",
    origin: "Allen Repashy Line", acquired: "—",
    desc: { ko: "프레야의 부친.", en: "Sire of Freya." }, offspring: ["P-002"] },
  { id: "PG-104", name: "Lilly Founder", nameKr: "릴리 파운더", genetics: ["Lilly White","Hypo"], sex: "F", birth: "2017-08-14",
    origin: "Allen Repashy Line", acquired: "—",
    sire: "PGG-203", dam: "PGG-204",
    desc: { ko: "프레야의 모친. 릴리 라인 시조.", en: "Dam of Freya. Lilly line founder." }, offspring: ["P-002"] },
  { id: "PG-105", name: "Azantic Prime", nameKr: "아잔틱 프라임", genetics: ["Azantic"], sex: "M", birth: "2017-09-02",
    origin: "Northern Gecko", acquired: "—",
    desc: { ko: "제우스·아폴로의 부친.", en: "Sire of Zeus and Apollo." }, offspring: ["P-003","P-006"] },
  { id: "PG-106", name: "Sable Mama", nameKr: "세이블 마마", genetics: ["Super Sable"], sex: "F", birth: "2017-11-18",
    origin: "Northern Gecko", acquired: "—",
    desc: { ko: "제우스의 모친.", en: "Dam of Zeus." }, offspring: ["P-003"] },
  { id: "PG-107", name: "Cappuccino Sr.", nameKr: "카푸치노 시니어", genetics: ["Cappuccino"], sex: "M", birth: "2018-02-10",
    origin: "Pangea Reptile", acquired: "—",
    desc: { ko: "헤라의 부친.", en: "Sire of Hera." }, offspring: ["P-005"] },
  { id: "PG-108", name: "Luwak Mama", nameKr: "루왁 마마", genetics: ["Luwak"], sex: "F", birth: "2018-05-20",
    origin: "Pangea Reptile", acquired: "—",
    desc: { ko: "헤라의 모친.", en: "Dam of Hera." }, offspring: ["P-005"] },
  { id: "PG-109", name: "Lilly White Sr.", nameKr: "릴리화이트 시니어", genetics: ["Lilly White"], sex: "M", birth: "2017-12-01",
    origin: "Northern Gecko", acquired: "—",
    desc: { ko: "아르테미스의 부친.", en: "Sire of Artemis." }, offspring: ["P-007"] },
  { id: "PG-110", name: "Het Azantic Mama", nameKr: "헷 아잔틱 마마", genetics: ["100% Het Azantic"], sex: "F", birth: "2018-03-12",
    origin: "Northern Gecko", acquired: "—",
    desc: { ko: "아르테미스의 모친.", en: "Dam of Artemis." }, offspring: ["P-007"] },

  // Generation 3 — great-grandparents (very limited)
  { id: "PGG-201", name: "Origin Sable", nameKr: "오리진 세이블", genetics: ["Sable"], sex: "M", birth: "2015-06-15",
    origin: "Wild import line", acquired: "—",
    desc: { ko: "라인 최초기 수컷. 자세한 정보 없음.", en: "Earliest known male. Limited info." }, offspring: ["PG-101"] },
  { id: "PGG-202", name: "Origin Female", nameKr: "오리진 암컷", genetics: ["Wild type"], sex: "F", birth: "2015-09-20",
    origin: "Unknown", acquired: "—",
    desc: { ko: "정보 미확보.", en: "No documentation." }, offspring: ["PG-101"] },
  { id: "PGG-203", name: "Lilly Patriarch", nameKr: "릴리 패트리아크", genetics: ["Lilly White"], sex: "M", birth: "2014-04-08",
    origin: "Allen Repashy Original", acquired: "—",
    desc: { ko: "릴리 라인 최초의 수컷 중 하나.", en: "One of the earliest Lilly White males." }, offspring: ["PG-104"] },
  { id: "PGG-204", name: "Hypo Founder", nameKr: "하이포 파운더", genetics: ["Hypo"], sex: "F", birth: "2014-07-19",
    origin: "Allen Repashy Original", acquired: "—",
    desc: { ko: "하이포 표현형 파운더.", en: "Hypo phenotype founder." }, offspring: ["PG-104"] }
];

window.VG_MINOR = [
  { id: "M-001", name: "Gargoyle", nameKr: "가고일 게코", species: "Rhacodactylus auriculatus", price: 520000, status: "available",
    desc: { ko: "스트라이프 패턴의 가고일 게코 성체.", en: "Striped gargoyle gecko adult." } },
  { id: "M-002", name: "Leachianus", nameKr: "리치아누스 게코", species: "Rhacodactylus leachianus", price: 2400000, status: "available",
    desc: { ko: "GT 라인 대형 리치.", en: "GT-line large leachianus." } },
  { id: "M-003", name: "Chahoua", nameKr: "차후아 게코", species: "Mniarogekko chahoua", price: 980000, status: "reserved",
    desc: { ko: "패인 아일랜드 라인 차후아.", en: "Pine Isle line chahoua." } },
  { id: "M-004", name: "Eyelash Viper Gecko", nameKr: "아일래쉬 게코", species: "Strophurus ciliaris", price: 280000, status: "available",
    desc: { ko: "오스트레일리안 아일래쉬.", en: "Australian eyelash gecko." } }
];

window.VG_GOODS = [
  { id: "G-001", name: "Terrarium Arboreal L", nameKr: "수목형 테라리움 L", category: "enclosure", price: 189000, stock: 6,
    desc: { ko: "45×45×60cm 수목형 사육장.", en: "45×45×60cm arboreal terrarium." } },
  { id: "G-002", name: "CGD Diet — Watermelon", nameKr: "CGD 사료 — 수박", category: "food", price: 28000, stock: 42,
    desc: { ko: "판게아 프리미엄 수박맛 CGD.", en: "Pangea premium watermelon CGD." } },
  { id: "G-003", name: "Ceramic Hide", nameKr: "세라믹 은신처", category: "decor", price: 34000, stock: 18,
    desc: { ko: "천연 점토 은신처.", en: "Natural clay hide." } },
  { id: "G-004", name: "Hygrometer", nameKr: "디지털 온습도계", category: "tool", price: 22000, stock: 30,
    desc: { ko: "사육장용 디지털 계측기.", en: "Digital enclosure meter." } },
  { id: "G-005", name: "Magnetic Ledge", nameKr: "자석 쉘프", category: "decor", price: 46000, stock: 12,
    desc: { ko: "수목형 사육장 쉘프.", en: "Arboreal ledge with magnet mount." } },
  { id: "G-006", name: "Deep Drainage Soil 10L", nameKr: "드레인 베딩 10L", category: "bedding", price: 38000, stock: 22,
    desc: { ko: "생체활성 바이오 베딩.", en: "Bioactive drainage substrate." } }
];
