const initialState = [
  {
    category: 2,
    categoryTitle: "Bebe 0-2",
    name: "",
    lastName: "",
    phone: "",
    birthday: "",
    price_rsd: 2950,
  },
  {
    category: 3,
    categoryTitle: "Deca 2-12",
    name: "",
    lastName: "",
    phone: "",
    birthday: "",
    price_rsd: 7375,
  },
  {
    category: 4,
    categoryTitle: "Mladi 12-26",
    name: "",
    lastName: "",
    phone: "",
    birthday: "",
    price_rsd: 13275,
  },
  {
    category: 4,
    categoryTitle: "Mladi 12-26",
    name: "",
    lastName: "",
    phone: "",
    birthday: "",
    price_rsd: 13275,
  },
  {
    category: 1,
    categoryTitle: "Odrasli 26-60",
    name: "",
    lastName: "",
    phone: "",
    birthday: "",
    price_rsd: 14750,
  },
  {
    category: 1,
    categoryTitle: "Odrasli 26-60",
    name: "",
    lastName: "",
    phone: "",
    birthday: "",
    price_rsd: 14750,
  },
  {
    category: 5,
    categoryTitle: "Seniori 60+",
    name: "",
    lastName: "",
    phone: "",
    birthday: "",
    price_rsd: 13275,
  },
];

const passengersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_PASSENGERS_INFO":
      return (state = action.payload);
    default:
      return state;
  }
};

export default passengersReducer;
