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
  noData?:string
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

const UserTable = <T extends { [ key: string ]: any; }> ( { data, columns, rowsPerPage,noData="No data available" }: UserTableProps<T> ) =>
{
  const [ page, setPage ] = useState( 1 );
  const rowPerPage = rowsPerPage || 10;
  const pages = Math.ceil( data?.length / rowPerPage );

  const items = useMemo( () =>
  { 
     if (!Array.isArray(data)) {
    console.error("Expected data to be an array but got:", data);
    return []; // Return an empty array or handle it appropriately
  }
    const start = ( page - 1 ) * rowPerPage;
    const end = start + rowPerPage;
    console.log("start",start,"end",end);
    return data?.slice( start, end );
  }, [ page, data, rowPerPage ] );

  const renderColumn = (column: Column, columnKey: string): ReactNode => {
    switch (columnKey) {
      case 'id':
        return (
          <div className="flex justify-start">
            <span className="uppercase">ID</span>
          </div>
        );
      case 'name':
        return (
          <div className="flex w-[60%] mx-auto justify-start">
            <span className="uppercase">Fam Users</span>
          </div>
        );
      case 'stars':
        return (
          <div className="flex justify-start">
            <span className="uppercase">Stars</span>
          </div>
        );
      case 'xps':
        return (
          <div className="flex justify-start ">
            <span className="uppercase">XPs</span>
          </div>
        );
      case 'fampoints':
        return (
          <div className="flex justify-start">
            <span className="uppercase">Fps</span>
          </div>
        );
      case 'earnings':
        return (
          <div className="flex justify-start">
            <span className="uppercase">Earnings</span>
          </div>
        );
      case 'referralCount':
        return (
          <div className="flex justify-center">
            <span className="uppercase">Referrals</span>
          </div>
        );
      case 'actions':
        return (
          <div className="flex justify-start">
            <span className="uppercase">Actions</span>
          </div>
        );
      case 'level':
        return (
          <div className="flex justify-start">
            <span className="uppercase">Level</span>
          </div>
        );
      default:
        return (
          <div className="flex justify-start">
            <span>{columnKey}</span>
          </div>
        );
    }
  };

  const renderCell = useCallback( ( user: T, columnKey: string ): ReactNode =>
  {
    const cellValue = user[ columnKey ];
    // console.log( "user",user );
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
          <div className="flex justify-start md:w-[60%] mx-auto items-center gap-2 font-famFont uppercase">
          {
            user?.rankByReferredUser && (<span className="font-famFont text-famPurple text-end text-md">#{user?.rankByReferredUser}</span>)
          }
            <User
              classNames={{
                base:"px-0"
              }}
              avatarProps={ { radius: "md", src: user?.domain?.image || user?.image || '', size: "sm" } }
              name={ user?.domain?.domainAddress || '' }
              description={ user?.displayName || ''}
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
              {/* <span className="uppercase sm:px-2 font-famFont text-white opacity-30">Xps </span> */}
              <span>{ user.rewards?.xp || cellValue || 0 }</span>
          </div>
        );
      case "fampoints":
        return (
          <div className="flex gap-2 items-start justify-start">
            {/* <span className=" uppercase sm:px-2 font-famFont text-white opacity-30">Fps </span> */}
            <span >{ user.rewards?.coins || cellValue || 0 }</span>
          </div>
        );
      case "earnings":
         return (
          <div className="flex gap-2 items-start justify-start">
            {/* <div className=" uppercase sm:px-2 font-famFont text-white opacity-30">Earnings </div> */}
            <div className="flex justify-start gap-1" ><span>{(user?.referredUserCount)*2.5 || cellValue || 0 }</span><span>USDC</span></div>
          </div>
        );
      case "referralCount":
         return (
          <div className="flex gap-2 items-start justify-center">
            {/* <span className=" uppercase sm:px-2 font-famFont text-white opacity-30">Referral Count </span> */}
            <span >{ user?.referredUserCount || cellValue || 0 }</span>
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
        
        aria-label="Example table with custom cells"
        style={ {
          boxShadow: 'rgb(29 27 27 / 62%) -5px 0px 20px 2px, inset 0px -40px 63px 5px rgb(24 24 24 / 62%)',
        } }
        classNames={ {
          wrapper: "bg-black text-white font-famFont ",
        } }
      >
        <TableHeader  columns={ columns }>
          { ( column ) => (
            <TableColumn className="bg-black" key={ column.uid }>
             {renderColumn(column,column.uid)}
            </TableColumn>
          ) }
        </TableHeader>
        <TableBody items={ items } emptyContent={ noData }>
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