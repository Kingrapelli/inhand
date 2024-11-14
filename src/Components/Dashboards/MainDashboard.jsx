import { React, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart } from '@mui/x-charts';
import { API_URL, DBJSON_URL } from '../../Services/auth';


const MainDashboard = () => {
    const [barData, setBarData] = useState();
    const [xaxisdata, setxaxisdata] = useState();
    const [yaxisdata, setyaxisdata] = useState();
    // const [transport, setTransport ] = useState();
    let transport = [];
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(()=>{
        getTransportData();
    },[]);

    const getCharData = async () => {
        const req = await fetch(`${DBJSON_URL}/transactions`);
        const res = await req.json();
        if(res.length){
            const finalRes = res.filter(item=> {
                return item.owner == user.id
            })
            setBarData(finalRes);
            let _xaxis = [];
            let _yaxis = [{ data : [1, 2]}, { data : [200, 250]}];
            console.log(transport);
            finalRes.forEach(item=>{
                transport.forEach(trans=>{
                    if(item.ownerfor == trans.id){
                        _xaxis.push(trans.name);
                    }
                })
                // let obj = { data : [1, 150]};
                // _yaxis.push(obj);
            })
            console.log(_xaxis, _yaxis);
            setxaxisdata(_xaxis);
            setyaxisdata(_yaxis);
        }else{
            setBarData();
        }
    }

    const getTransportData = () => {
        return new Promise(async (resolve,reject)=>{
            const req = await fetch(`${DBJSON_URL}/transport`);
            const res = await req.json();
            if(res.length){
                // await setTransport(res);
                transport = res;
                getCharData(); // getting data preparing chart
                resolve(true);
            }else{
                // setTransport();
                transport= [];
            }
        })
    }

    return (
        <>
            {
                barData && user && <>
                    {/* <BarChart
                        xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
                        series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                        width={500}
                        height={300}
                    /> */}
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: xaxisdata }]}
                        series={yaxisdata}
                        width={500}
                        height={300}
                        barLabel="value"
                    />
                </>
            }
        </>
    )
}

export default MainDashboard;