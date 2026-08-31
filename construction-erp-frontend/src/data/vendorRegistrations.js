export const WRITING_STATUS = '1010'

export const progressStatuses = [
  { code: '1010', label: '작성중' },
  { code: '2020', label: '서류심사' },
  { code: '3030', label: '최종심사' },
  { code: '9090', label: '등록완료' },
]

export const licenseKinds = ['전문건설업', '종합건설업', '전기공사업', '정보통신공사업', '소방시설공사업']

export const tradeCatalog = [
  { majorCode: 'C01', majorName: '토목', tradeCode: 'C0101', tradeName: '토공사업' },
  { majorCode: 'C01', majorName: '토목', tradeCode: 'C0102', tradeName: '철근·콘크리트공사업' },
  { majorCode: 'C02', majorName: '건축', tradeCode: 'C0201', tradeName: '실내건축공사업' },
  { majorCode: 'C02', majorName: '건축', tradeCode: 'C0202', tradeName: '금속창호·지붕건축물조립공사업' },
  { majorCode: 'C03', majorName: '설비', tradeCode: 'C0301', tradeName: '기계설비·가스공사업' },
  { majorCode: 'C03', majorName: '설비', tradeCode: 'C0302', tradeName: '전기공사업' },
]

export const emptyRegistration = () => ({
  id: `NEW-${Date.now()}`,
  businessNumber: '',
  registrationDate: new Date().toISOString().slice(0, 10),
  registrationSeq: '001',
  vendorCode: '',
  vendorName: '',
  vendorType: '법인사업자',
  progressStatus: WRITING_STATUS,
  finalReviewYn: 'N',
  representativeName: '',
  phone: '',
  email: '',
  address: '',
  establishedDate: '',
  capital: '',
  creditRating: '',
  employeeCount: '',
  engineerCount: '',
  safetyTrainingYn: 'N',
  reviewScore: '',
  reviewGrade: '',
  reviewOpinion: '',
  permissions: { canSave: true },
  trades: [],
  attachments: [],
})

export const initialVendorRegistrations = [
  {
    id: 'VR-2026-001',
    businessNumber: '120-81-48293',
    registrationDate: '2026-08-21',
    registrationSeq: '001',
    vendorCode: 'BP-0182',
    vendorName: '한빛전기 주식회사',
    vendorType: '법인사업자',
    progressStatus: '1010',
    finalReviewYn: 'N',
    representativeName: '정한빛',
    phone: '02-3471-8200',
    email: 'partner@hanbit-elec.co.kr',
    address: '서울특별시 강서구 마곡중앙로 171',
    establishedDate: '2011-04-08',
    capital: '1500000000',
    creditRating: 'BBB+',
    employeeCount: '48',
    engineerCount: '17',
    safetyTrainingYn: 'Y',
    reviewScore: '',
    reviewGrade: '',
    reviewOpinion: '작성 완료 후 서류심사가 시작됩니다.',
    permissions: { canSave: true },
    trades: [
      { id: 'TR-001', majorCode: 'C03', majorName: '설비', tradeCode: 'C0302', tradeName: '전기공사업', licenseKind: '전기공사업', licenseNumber: '서울-01234', acquiredDate: '2013-05-11', representativeYn: 'Y', performanceAmount: '2840000000' },
    ],
    attachments: [
      { id: 'AT-001', fileName: '사업자등록증.pdf', size: 284390, mimeType: 'application/pdf', registeredBy: '김ERP', registeredAt: '2026-08-21 10:14' },
      { id: 'AT-002', fileName: '전기공사업등록증.pdf', size: 519204, mimeType: 'application/pdf', registeredBy: '김ERP', registeredAt: '2026-08-21 10:16' },
    ],
  },
  {
    id: 'VR-2026-002',
    businessNumber: '214-86-75910',
    registrationDate: '2026-08-18',
    registrationSeq: '001',
    vendorCode: 'BP-0144',
    vendorName: '대성토건',
    vendorType: '법인사업자',
    progressStatus: '2020',
    finalReviewYn: 'N',
    representativeName: '박대성',
    phone: '031-721-4040',
    email: 'ds@daesung-const.co.kr',
    address: '경기도 성남시 분당구 판교로 242',
    establishedDate: '2004-11-17',
    capital: '3200000000',
    creditRating: 'A-',
    employeeCount: '76',
    engineerCount: '31',
    safetyTrainingYn: 'Y',
    reviewScore: '86',
    reviewGrade: 'B+',
    reviewOpinion: '재무건전성 양호. 안전보건 관리계획 보완 요청.',
    permissions: { canSave: true },
    trades: [
      { id: 'TR-002', majorCode: 'C01', majorName: '토목', tradeCode: 'C0101', tradeName: '토공사업', licenseKind: '전문건설업', licenseNumber: '경기-08-115', acquiredDate: '2005-03-22', representativeYn: 'Y', performanceAmount: '7360000000' },
      { id: 'TR-003', majorCode: 'C01', majorName: '토목', tradeCode: 'C0102', tradeName: '철근·콘크리트공사업', licenseKind: '전문건설업', licenseNumber: '경기-10-208', acquiredDate: '2010-06-03', representativeYn: 'N', performanceAmount: '4120000000' },
    ],
    attachments: [
      { id: 'AT-003', fileName: '신용평가서_2026.pdf', size: 824111, mimeType: 'application/pdf', registeredBy: '이구매', registeredAt: '2026-08-18 15:22' },
    ],
  },
  {
    id: 'VR-2026-003',
    businessNumber: '104-87-02911',
    registrationDate: '2026-07-29',
    registrationSeq: '002',
    vendorCode: 'BP-0098',
    vendorName: '성진설비',
    vendorType: '법인사업자',
    progressStatus: '9090',
    finalReviewYn: 'Y',
    representativeName: '이우진',
    phone: '02-6901-0098',
    email: 'admin@sungjin-mep.co.kr',
    address: '서울특별시 영등포구 여의대로 24',
    establishedDate: '1998-02-10',
    capital: '5100000000',
    creditRating: 'A+',
    employeeCount: '112',
    engineerCount: '54',
    safetyTrainingYn: 'Y',
    reviewScore: '94',
    reviewGrade: 'A',
    reviewOpinion: '최종심사 적격. 우수 협력업체로 등록되었습니다.',
    permissions: { canSave: true },
    trades: [
      { id: 'TR-004', majorCode: 'C03', majorName: '설비', tradeCode: 'C0301', tradeName: '기계설비·가스공사업', licenseKind: '전문건설업', licenseNumber: '서울-98-042', acquiredDate: '1998-07-01', representativeYn: 'Y', performanceAmount: '12980000000' },
    ],
    attachments: [
      { id: 'AT-004', fileName: '최종심사결과서.pdf', size: 412821, mimeType: 'application/pdf', registeredBy: '최심사', registeredAt: '2026-08-12 09:05' },
    ],
  },
]

export const getStatusLabel = (code) => progressStatuses.find((status) => status.code === code)?.label ?? code

export const canEditRegistration = (registration) => Boolean(
  registration
  && registration.progressStatus === WRITING_STATUS
  && registration.permissions?.canSave,
)
