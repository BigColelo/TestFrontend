import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  TextField,
  Button,
  ButtonGroup,
  Box,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { useEffect, useState } from "react";

// Definizione delle interfacce
interface Department {
  code: string;
  description: string;
}

interface EmployeeListQuery {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  department: Department | null;
}

export default function EmployeeListPage() {
  const [list, setList] = useState<EmployeeListQuery[]>([]);
  const [filteredList, setFilteredList] = useState<EmployeeListQuery[]>([]); // Stato per i dati filtrati
  const [filter, setFilter] = useState<string>(""); // Stato per il filtro
  const [sortBy, setSortBy] = useState<"firstName" | "lastName" | "">(""); // Stato per il campo di ordinamento
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Stato per l'ordine (crescente o decrescente)

  // Effetto per caricare i dati dall'endpoint
  useEffect(() => {
    fetch("/api/employees/list")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore durante il fetch");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Stampa i dati nella console
        setList(data as EmployeeListQuery[]);
        setFilteredList(data); // Inizialmente, i dati filtrati sono uguali a tutti i dati
      })
      .catch((error) => {
        console.error("Errore durante il fetch:", error); // Stampa eventuali errori
      });
  }, []);

  // Effetto per applicare il filtro ogni volta che il testo di ricerca cambia
  useEffect(() => {
    if (filter) {
      const filtered = list.filter((employee) =>
        employee.firstName.toLowerCase().includes(filter.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(filter.toLowerCase())
      );
      setFilteredList(filtered);
    } else {
      setFilteredList(list); // Se il filtro è vuoto, mostra tutti i dati
    }
  }, [filter, list]);

  // Ordina i dati in base al campo selezionato e all'ordine
  const sortedList = [...filteredList].sort((a, b) => {
    if (!sortBy) return 0; // Se non è selezionato alcun ordinamento, non fare nulla

    const fieldA = a[sortBy].toLowerCase(); // Campo da ordinare (firstName o lastName)
    const fieldB = b[sortBy].toLowerCase();

    if (fieldA < fieldB) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (fieldA > fieldB) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Funzione per esportare i dati in XML
  const exportToXml = () => {
    const xmlData = `
      <employees>
        ${sortedList.map((employee) => `
          <employee>
            <id>${employee.id}</id>
            <code>${employee.code}</code>
            <firstName>${employee.firstName}</firstName>
            <lastName>${employee.lastName}</lastName>
            <address>${employee.address}</address>
            <email>${employee.email}</email>
            <phone>${employee.phone}</phone>
            <department>
              <code>${employee.department ? employee.department.code : "N/A"}</code>
              <description>${employee.department ? employee.department.description : "N/A"}</description>
            </department>
          </employee>
        `).join("")}
      </employees>
    `;

    const blob = new Blob([xmlData], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "employees.xml";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Employees
      </Typography>

      {/* Campo di input per il filtro */}
      <TextField
        label="Filter by First Name or Last Name"
        variant="outlined"
        fullWidth
        sx={{ mb: 4 }}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

<Box
  sx={{
    display: "flex", // Usa un layout flessibile
    justifyContent: "space-between", // Allinea gli elementi agli estremi
    alignItems: "center", // Centra verticalmente gli elementi
    mb: 3, // Margine inferiore per distanziare dalla tabella
  }}
>
  {/* Pulsanti di ordinamento (a sinistra) */}
  <ButtonGroup
    variant="outlined"
    size="small"
    sx={{
      "& .MuiButton-root": {
        color: "#1976d2",
        borderColor: "#1976d2",
        "&:hover": {
          backgroundColor: "#1976d2",
          color: "#fff",
        },
      },
    }}
  >
    <Button
      onClick={() => {
        setSortBy("firstName");
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      }}
      startIcon={sortBy === "firstName" ? (sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />) : null}
    >
      First Name
    </Button>

    <Button
      onClick={() => {
        setSortBy("lastName");
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      }}
      startIcon={sortBy === "lastName" ? (sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />) : null}
    >
      Last Name
    </Button>
  </ButtonGroup>

  {/* Pulsante di esportazione XML (a destra) */}
  <Button
    variant="outlined"
    size="small"
    onClick={exportToXml}
    sx={{
      color: "#4caf50", // Colore del testo (verde)
      borderColor: "#4caf50", // Colore del bordo (verde)
      "&:hover": {
        backgroundColor: "#4caf50", // Colore di sfondo al passaggio del mouse
        color: "#fff", // Colore del testo al passaggio del mouse
      },
    }}
  >
    Export to XML
  </Button>
</Box>

      

      {/* Tabella */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Code</StyledTableHeadCell>
              <StyledTableHeadCell>First Name</StyledTableHeadCell>
              <StyledTableHeadCell>Last Name</StyledTableHeadCell>
              <StyledTableHeadCell>Address</StyledTableHeadCell>
              <StyledTableHeadCell>Email</StyledTableHeadCell>
              <StyledTableHeadCell>Phone</StyledTableHeadCell>
              <StyledTableHeadCell>Department Code</StyledTableHeadCell>
              <StyledTableHeadCell>Department Description</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedList.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.firstName}</TableCell>
                <TableCell>{row.lastName}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{row.phone}</TableCell>
                <TableCell>{row.department ? row.department.code : "N/A"}</TableCell>
                <TableCell>{row.department ? row.department.description : "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

// Stile per le celle dell'intestazione della tabella
const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
}));