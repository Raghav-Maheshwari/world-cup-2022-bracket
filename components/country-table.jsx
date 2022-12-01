import styles from './country-table.module.css';
import Table, {
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@kiwicom/orbit-components/lib/Table";
import Heading from '@kiwicom/orbit-components/lib/Heading';

export const CountryTable = ({ countries }) => {
  const countryList = countries.sort((countryA, countryB) => {
    return countryB.score - countryA.score
  })
  .splice(0, 10)
  .map(country => {
    return (
      <TableRow key={country._id}>
        <TableCell>{country.name} <img className={styles.countryFlag} src={country.flag_url} /></TableCell>
        <TableCell>{country.score.toFixed(2)}</TableCell>
      </TableRow>
    )
  })

  return (
   <div className={styles.tableContainer}>
    <Heading type="title2">Top countries</Heading>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Country</TableCell>
          <TableCell>Points</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {countryList}
      </TableBody>
    </Table>
   </div>
  )
}