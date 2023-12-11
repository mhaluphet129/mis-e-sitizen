import moment from "moment";
import dayjs from "dayjs";

const master_list = [
  {
    title: "NO",
    align: "center",
    width: 50,
    render: (_, __, i) => i + 1,
  },
  {
    title: "LAST",
    width: 200,
    render: (_, row) => row?.name?.lastname?.toUpperCase(),
  },
  {
    title: "FIRST",
    width: 200,

    render: (_, row) => row?.name?.name?.toUpperCase(),
  },
  {
    title: "MIDDLE",
    width: 200,
    render: (_, row) => row?.name?.middlename?.toUpperCase(),
  },
  {
    title: "BARANGAY",
    align: "center",
    width: 150,
    render: (_, row) => row?.barangay?.toUpperCase(),
  },
  {
    title: "AGE",
    align: "center",
    width: 1,
    render: (_, row) =>
      dayjs().diff(
        dayjs(row?.dateOfBirth).format("YYYY-MM-DD"),
        "years",
        false
      ),
  },
  {
    title: "GENDER",
    align: "center",
    width: 1,
    render: (_, row) => row?.gender?.toUpperCase(),
  },
  {
    title: "CIVIL STATUS",
    width: 50,
    align: "center",
    render: (_, row) => row?.maritalStatus?.toUpperCase(),
  },
  {
    title: "BIRTHDATE ",
    width: 1,
    align: "center",
    render: (_, row) =>
      moment(row?.dateOfBirth?.toUpperCase()).format("DD/MM/YYYY"),
  },
  {
    title: "OSCA ID NO.",
    width: 50,
    align: "center",
    render: (_, row) => row?.name.id?.toUpperCase(),
  },
];

const pension_status = [
  {
    title: "NO",
    align: "center",
    width: 50,
    render: (_, __, i) => i + 1,
  },
  {
    title: "LAST",
    width: 200,
    render: (_, row) => row?.name?.lastname?.toUpperCase(),
  },
  {
    title: "FIRST",
    width: 200,

    render: (_, row) => row?.name?.name?.toUpperCase(),
  },
  {
    title: "MIDDLE",
    width: 200,
    render: (_, row) => row?.name?.middlename?.toUpperCase(),
  },
  {
    title: "BARANGAY",
    width: 180,
    render: (_, row) => row?.barangay?.toUpperCase(),
  },
  {
    title: "Pension Status",
    width: 180,
    render: (_, row) =>
      row?.pensionerType == "social"
        ? "Social"
        : row?.pensionerType == "private"
        ? "Private"
        : row?.pensionerType == "none"
        ? "For Validation"
        : "No Data",
  },
];

const living_status = [
  {
    title: "NO",
    align: "center",
    width: 50,
    render: (_, __, i) => i + 1,
  },
  {
    title: "LAST",
    width: 200,
    render: (_, row) => row?.name?.lastname?.toUpperCase(),
  },
  {
    title: "FIRST",
    width: 200,

    render: (_, row) => row?.name?.name?.toUpperCase(),
  },
  {
    title: "MIDDLE",
    width: 200,
    render: (_, row) => row?.name?.middlename?.toUpperCase(),
  },
  {
    title: "BARANGAY",
    width: 180,
    render: (_, row) => row?.barangay?.toUpperCase(),
  },
  {
    title: "Living Status",
    width: 180,
    render: (_, row) => row?.status,
  },
];

export default () => null;
export { master_list, pension_status, living_status };
