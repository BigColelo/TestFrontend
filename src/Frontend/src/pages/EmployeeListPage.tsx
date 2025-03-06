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
  } from "@mui/material";
  import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
  import { useEffect, useState } from "react";
  
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
  
    useEffect(() => {
        // Effetto per caricare i dati dall'endpoint
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

        <ButtonGroup
        variant="outlined" // Variante più leggera
        size="small" // Dimensione più compatta
        sx={{
            mb: 3, // Margine inferiore per distanziarli dalla tabella
            "& .MuiButton-root": {
            color: "#1976d2", // Colore del testo (blu)
            borderColor: "#1976d2", // Colore del bordo (blu)
            "&:hover": {
                backgroundColor: "#1976d2", // Colore di sfondo al passaggio del mouse
                color: "#fff", // Colore del testo al passaggio del mouse
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
  
  const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  }));
  