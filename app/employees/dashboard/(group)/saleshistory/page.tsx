'use client'
import PosButton from '@/app/_components/PosButton'
import PosTable from '@/app/_components/PosTable'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function AdminSalesHistoryPage() {
    const router = useRouter()
  return (
    <>
    <div className='mt-5'>
      <div className='flex flex-row justify-between'>
        <div className='wrapper p-5 rounded-xl shadow-lg w-[800px] bg-white'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold'>Sales History</h1>
            <PosButton icon={faPlus} onClick={() => router.push('/employees/dashboard/saleshistory/add')}>Transaction</PosButton>
          </div>
          {/* <div className='flex justify-between items-center'>
            <h3>Show
              <div className=''></div>
            </h3>
            <input type="text" className='outline outline-1 outline-posgray px-3 rounded-md w-[200px] h-[35px]' placeholder='Search Member' />
          </div> */}
          <div className='mt-3'>
          <PosTable fixed headers={['Nomor Referensi',  'Tanggal', 'Customer ID', 'Employee ID','Total', "Action"]}>
              <tr>
                <td className='p-3'>758647857633</td>
                <td className='p-3'>09/12/2023 09.21</td>
                <td className='p-3'>SK_0004</td>
                <td className='p-3'>SK1_0054</td>
                <td className='p-3'>Rp. 120.000</td>
                <td className='p-3'>
                  <div className='flex gap-2'>
                    <button onClick={() => {}} className='text-black bg-teal-300 px-5 py-1 rounded-md hover:text-white hover:bg-teal-500 transition' ><FontAwesomeIcon icon={faEye}/></button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className='p-3'>758647857633</td>
                <td className='p-3'>09/12/2023 09.21</td>
                <td className='p-3'>SK_0004</td>
                <td className='p-3'>SK1_0054</td>
                <td className='p-3'>Rp. 120.000</td>
                <td className='p-3'>
                  <div className='flex gap-2'>
                    <button onClick={() => {}} className='text-black bg-teal-300 px-5 py-1 rounded-md hover:text-white hover:bg-teal-500 transition' ><FontAwesomeIcon icon={faEye}/></button>
                  </div>
                </td>
              </tr>
          </PosTable>
          </div> 
        </div>
        <div className='wrapper p-2 shadow-lg w-[450px] h-full bg-white rounded-xl'>
          <div className='flex justify-center items-center'>
            <div className='flex flex-col'>
              <h1 className='text-2xl font-bold flex justify-center'>Transaction Details</h1>
                <div className='flex flex-col gap-2'>
                <div className="border-t-[2px] border-solid border-black"></div>
                  <div className='wrapper w-[400px] h-[450px] bg-gray-200'>
                    <div className='flex flex-col'>
                      <div className='flex justify-center mt-5'>
                        <div className='flex gap-1'>
                          <div className='flex flex-col'>
                            <h1 className='flex justify-center text-sm font-semibold'>Surya Kencana</h1>
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-center mt-2'>
                        <div className='grid grid-rows-2 grid-flow-col gap-x-12 gap-y-1'>
                          <div className='text-xs font-semibold'>Kasir : SK2_0001</div>
                          <div className='text-xs font-semibold'>Waktu : 09 /12/2023</div>
                          <div className='text-xs font-semibold'>Member : Bagus</div>
                          <div className='text-xs font-semibold flex justify-center'>08:45:40</div>
                        </div>
                      </div>
                      <div className='p-5'>
                      <table className='w-full table-auto'>
                        <thead className='border border-x-0 border-y-2 border-dashed border-black'>
                          <tr>
                            <th className='text-start text-xs py-2 w-1/2'>Produk</th>
                            <th className='text-center text-xs'>Qty</th>
                            <th className='text-center text-xs'>Harga</th>
                            <th className='text-center text-xs'>Total</th>
                          </tr>
                        </thead>
                        <tbody className='border border-x-0 border-y-2 border-dashed border-black'>
                          <tr>
                            <td className='text-xs font-semibold py-2'>Minyak Sanco 1 Liter </td>
                            <td className='text-center text-xs font-semibold py-2'>1</td>
                            <td className='text-center text-xs font-semibold py-2'>10.000</td>
                            <td className='text-center text-xs font-semibold py-2'>10.000</td>
                          </tr>
                          <tr>
                            <td className='text-xs font-semibold py-2'>Mie Rendang </td>
                            <td className='text-center text-xs font-semibold py-2'>1</td>
                            <td className='text-center text-xs font-semibold py-2'>10.000</td>
                            <td className='text-center text-xs font-semibold py-2'>10.000</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className='pt-2'>
                          <h1 className='text-xs font-semibold py-1'>Total : Rp. 42.000,</h1>
                          <h1 className='text-xs font-semibold py-1'>Tunai : Rp. 50.000,</h1>
                          <h1 className='text-xs font-semibold py-1'>Kembali : Rp. 8.000</h1>
                      </div>
                      <div className="border border-x-0 border-y-[1px] border-dashed border-black"></div>                    
                        <div className='flex justify-center'>
                          <h1 className='text-xs font-semibold text-center py-2'>Terima Kasih Atas Kunjungan Anda <br /> Periksa Barang sebelum dibeli <br /> note : Barang yang suda
h dibeli tidak bisa ditukar</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
