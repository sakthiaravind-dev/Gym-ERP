export interface Member {
    id: number;
    name: string;
    gender: string;
    memberId: string;
    joinedDate: string;
    renewalStartDate: string;
    membershipEndingDate: string;
    memberPack: string;
    referredBy: string;
    personalTrainingEndingDate: string;
    trainerName: string;
    memberIdentityDocumentType: string;
    documentIdNumber: string;
    category: string;
    memberStatus: string;
    healthStatus: string;
    memberBranch: string;
  }
  
  const mockData: Member[] = [
    {
      id: 1,
      name: "Dinesh D",
      gender: "male",
      memberId: "70001",
      joinedDate: "21/04/2023",
      renewalStartDate: "01/07/2024",
      membershipEndingDate: "30/06/2025",
      memberPack: "annual",
      referredBy: "ASIF",
      personalTrainingEndingDate: "",
      trainerName: "",
      memberIdentityDocumentType: "",
      documentIdNumber: "",
      category: "",
      memberStatus: "active",
      healthStatus: "",
      memberBranch: "",
    },
    {
      id: 2,
      name: "Arun K",
      gender: "male",
      memberId: "70002",
      joinedDate: "15/05/2023",
      renewalStartDate: "01/08/2024",
      membershipEndingDate: "31/07/2025",
      memberPack: "monthly",
      referredBy: "Rahul",
      personalTrainingEndingDate: "01/08/2024",
      trainerName: "Karthik",
      memberIdentityDocumentType: "Aadhaar",
      documentIdNumber: "123456789012",
      category: "fitness",
      memberStatus: "active",
      healthStatus: "good",
      memberBranch: "Branch A",
    },
    {
      id: 3,
      name: "Priya S",
      gender: "female",
      memberId: "70003",
      joinedDate: "10/06/2023",
      renewalStartDate: "01/09/2024",
      membershipEndingDate: "31/08/2025",
      memberPack: "quarterly",
      referredBy: "Sneha",
      personalTrainingEndingDate: "31/12/2023",
      trainerName: "Ravi",
      memberIdentityDocumentType: "Passport",
      documentIdNumber: "AB1234567",
      category: "yoga",
      memberStatus: "active",
      healthStatus: "excellent",
      memberBranch: "Branch B",
    },
    {
      id: 4,
      name: "Vikram R",
      gender: "male",
      memberId: "70004",
      joinedDate: "05/07/2023",
      renewalStartDate: "01/10/2024",
      membershipEndingDate: "30/09/2025",
      memberPack: "semi-annual",
      referredBy: "Ajay",
      personalTrainingEndingDate: "01/01/2025",
      trainerName: "Sunil",
      memberIdentityDocumentType: "PAN",
      documentIdNumber: "ABCDE1234F",
      category: "weightlifting",
      memberStatus: "inactive",
      healthStatus: "average",
      memberBranch: "Branch C",
    },
    {
      id: 5,
      name: "Sneha T",
      gender: "female",
      memberId: "70005",
      joinedDate: "20/07/2023",
      renewalStartDate: "01/11/2024",
      membershipEndingDate: "31/10/2025",
      memberPack: "annual",
      referredBy: "Dinesh",
      personalTrainingEndingDate: "",
      trainerName: "Nisha",
      memberIdentityDocumentType: "Driving License",
      documentIdNumber: "TN01DL2023001",
      category: "cardio",
      memberStatus: "active",
      healthStatus: "good",
      memberBranch: "Branch D",
    },
  ];
  
  export default mockData;
  