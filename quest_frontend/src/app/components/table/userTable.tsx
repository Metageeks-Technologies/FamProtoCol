"use client";
import { useState, useMemo, useCallback, ReactNode } from "react";
import { User, Tooltip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";

type Column = {
  name: string;
  uid: string;
};

type UserTableProps<T> = {
  data: T[];
  columns: Column[];
  rowsPerPage?: number;
};

interface StarDisplayProps
{
  cellValue: number;
}

const StarDisplay: React.FC<StarDisplayProps> = ( { cellValue } ) =>
{
  const stars: JSX.Element[] = [];
  for ( let i = 0; i < cellValue; i++ )
  {
    stars.push( <i key={ i } className="bi bi-star-fill text-yellow-400 "></i> );
  }
  return <div className="flex flex-row justify-center gap-1 items-center">{ stars }</div>;
};

const UserTable = <T extends { [ key: string ]: any; }> ( { data, columns, rowsPerPage }: UserTableProps<T> ) =>
{
  const [ page, setPage ] = useState( 1 );
  const rowPerPage = rowsPerPage || 10;
  const pages = Math.ceil( data?.length / rowPerPage );

  const items = useMemo( () =>
  {
    const start = ( page - 1 ) * rowPerPage;
    const end = start + rowPerPage;
    return data.slice( start, end );
  }, [ page, data, rowPerPage ] );

  const renderCell = useCallback( ( user: T, columnKey: string ): ReactNode =>
  {
    const cellValue = user[ columnKey ];
    console.log( "user",user );
    switch ( columnKey )
    {
      case "id":
        return (
          <div className="capitalize w-[40%]">
            <span className="lvl text-end text-xl">{ columnKey || '' }</span>
          </div>
        );
      case "name":
        return (
          <div className="flex justify-start items-center gap-2 sm:px-2 font-famFont uppercase">
          {
            user?.rank && (<span className="font-famFont text-famViolate text-end text-md sm:px-2">#{user?.rank}</span>)
          }
            <User
              
              classNames={{
                base:"px-0"
              }}
              avatarProps={ { radius: "md", src: user?.image || '', size: "sm" } }
              name={ user?.displayName || user?.name || '' }
            />
          </div>
        );
      case "stars":
        return (
          <div className="flex justify-start items-center w-[40%]">
            <StarDisplay cellValue={ Number( cellValue ) || 0 } />
          </div>
        );
      case "xps":
        return (
          <div className="flex gap-2 items-center justify-start">
              <span className="uppercase sm:px-2 font-famFont text-white opacity-30">Xps </span>
              <span>{ user.rewards?.xp || cellValue || 0 }</span>
          </div>
        );
      case "fampoints":
        return (
          <div className="flex gap-2 items-center justify-start">
            <span className=" uppercase sm:px-2 font-famFont text-white opacity-30">Fampoints </span>
            <span >{ user.rewards?.coins || cellValue || 0 }</span>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <i className="bi bi-eye text-xl"></i>
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <i className="bi bi-pencil-square text-xl"></i>
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <i className="bi bi-trash-fill text-xl"></i>
              </span>
            </Tooltip>
          </div>
        );
      case "level":
        return (
          <div>
            <span className="text-[#FA00FF] uppercase font-famFont "> LVL: { user.level || 0 }</span>
          </div>
        );
      default:
        return String( cellValue || '' );
    }
  }, [] );

  return (
    <div className="w-full h-full">
      <Table
        hideHeader
        aria-label="Example table with custom cells"
        style={ {
          boxShadow: 'rgb(29 27 27 / 62%) -5px 0px 20px 2px, inset 0px -40px 63px 5px rgb(24 24 24 / 62%)',
        } }
        classNames={ {
          wrapper: "min-h-[222px] bg-black text-white ",
        } }
      >
        <TableHeader columns={ columns }>
          { ( column ) => (
            <TableColumn key={ column.uid }>
              { column.name }
            </TableColumn>
          ) }
        </TableHeader>
        <TableBody items={ items } emptyContent={ "No data available" }>
          { ( item ) => (
            <TableRow key={ item?.id || item?._id || `row-${ items.indexOf( item ) }` }>
              { ( columnKey: any ) => <TableCell>{ renderCell( item, columnKey ) }</TableCell> }
            </TableRow>
          ) }
        </TableBody>
      </Table>
      { data.length > 0 && (
        <div className="flex w-full justify-center ">
          <Pagination
            showControls
            showShadow
            page={ page }
            total={ pages }
            onChange={ ( page ) => setPage( page ) }
            classNames={ {
              cursor: "bg-[#5538CE]",
              
            } }
          />
        </div>
      ) }
    </div>
  );
};
export default UserTable;