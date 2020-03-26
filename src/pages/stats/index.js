import React, { useState } from 'react'
import { useFetchStats } from 'hooks/useFetchStats'
import { useTable, usePagination } from 'react-table'
import { toggleArrayItem } from 'utils'
import { Link } from "react-router-dom"
import Modal from 'react-modal'

Modal.setAppElement('#root')

const Table = ({ columns, data, onPageChange }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 }
    },
    usePagination
  )

  return (
    <div>
      <table {...getTableProps()} className="table mt-5">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps({className: column.headerClassName})} width={column.width}><strong>{column.render('Header')}</strong></th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps({className: cell.column.className})}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button className="btn btn-info btn-sm" onClick={() => {previousPage(); onPageChange()}} disabled={!canPreviousPage}>
          {'Prev'}
        </button>
        <button className="btn btn-info btn-sm mx-2" onClick={() => {nextPage(); onPageChange()}} disabled={!canNextPage}>
          {'Next'}
        </button>
        <span className="ml-auto">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
      </div>
    </div>
  )
}

const Stats = () => {
  const { stats, loading, error, setStats } = useFetchStats()
  const [ checked, setChecked] = useState([]);
  const [ isModalOpen, setModalOpen ] = useState(false);

  if (loading) return <div className="spinner-border d-block mx-auto my-5"></div>
  if (error) return <div>{error}</div>

  const handleCheckbox = (id) => {
    if (checked.length === 1 && checked.indexOf(id) > -1) 
      return

    setChecked(checked => {
      toggleArrayItem(checked, id);
      return [...checked];
    });
  }

  const columns = [
    {
      Header: ({ page, state: { pageSize }}) => (
        <input
          onChange={() => setChecked(page.map(r => r.original.id))}
          checked={checked.length === pageSize}
          disabled={checked.length === pageSize}
          type="checkbox"
        />
      )
      ,
      id: 'checkCell',
      Cell: ({row: { original }}) => (
        <input
          checked={checked.indexOf(original.id) > -1}
          onChange={() => handleCheckbox(original.id)}
          type="checkbox"
        />
      ),
      width: '3%'
    },
    {
      Header: 'Keyword',
      accessor: 'keyword'
    },
    {
      Header: '',
      id: 'exploreCell',
      Cell: ({row: { original }}) => (
        <Link to={'/explore/' + original.id} className="btn btn-secondary btn-sm">Explore</Link>
      ),      
    },
    {
      Header: '',
      id: 'showCell',
      Cell: ({row: { original }}) => (
        <button onClick={() => setModalOpen(true)} className="btn btn-secondary btn-sm">Show ({parseInt(original.suggestions_count) || 0})</button>
      ),      
    },
    {
      Header: 'Traffic Score',
      accessor: 'users_per_day',
      headerClassName: 'text-center',
      className: 'text-center'
    },
    {
      Header: 'Total Apps',
      accessor: 'total_apps',
      headerClassName: 'text-center',
      className: 'text-center'
    },
    {
      Header: 'Rank',
      id: 'rankCell',
      Cell: ({row: { original }}) => (
        <span>
          {original.position_info.position}{' '}
          {original.position_info.change !== null && 
            <span className={`${original.position_info.change > 0 ? 'text-success' : ''} ${original.position_info.change < 0 ? 'text-danger' : ''}`}>({ original.position_info.change })</span>
          }
        </span>
      ),         
      headerClassName: 'text-center',
      className: 'text-center'
    },
    {
      Header: 'Color',
      id: 'colorCell',
      Cell: ({row: { original }}) => (
        <div className={`mx-3 ${['bg-warning', 'bg-primary', 'bg-success', 'bg-danger', 'bg-info', 'bg-dark'][original.color]}`}>&nbsp;</div>
      ),         
      headerClassName: 'text-center',
      className: 'text-center'
    },
    {
      Header: '',
      id: 'deleteCell',
      Cell: ({row}) => (
        <button className="btn py-0 px-1"
          onClick={() => {
            setStats(stats.filter((item, index) => index !== row.index))
          }}
        >
          <svg height="18px" viewBox="-40 0 427 427.00131" width="18px" xmlns="http://www.w3.org/2000/svg"><path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"/><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/></svg>          
        </button>
      ),
      className: 'text-center'
    }



    
  ]

  return (
    <div>
      <Table columns={columns} data={stats} onPageChange={() => setChecked([])} />
      <Modal isOpen={isModalOpen}>
        <button className="btn btn-secondary float-right" onClick={() => setModalOpen(false)}>close</button>
      </Modal>      
    </div>
  )
}

export default Stats