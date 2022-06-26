import React, { useEffect, useState } from 'react';
import AuthService from "../services/auth.service";
// import Header from './Header';
// import NavbarAna from './NavbarAna';
// import SideBar from './SideBar';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ProgressBar from "@ramonak/react-progress-bar";
import uuid from 'react-uuid'

export default function HomeLoggedIn() {
    const currentUser = AuthService.getCurrentUser();

    const [incomes, setIncomes] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [limits, setLimits] = useState([]);
    const [savings, setSavings] = useState([]);

    const chartIncomeAmount = Object.values(incomes);
    const incomeSum = chartIncomeAmount.reduce((sum, a) => sum + a, 0);
    const chartIncomeNames = Object.keys(incomes);

    const chartStatisticsAmount = statistics.map(x => x.amount);
    const expenseSum = chartStatisticsAmount.reduce((sum, a) => sum + a, 0);
    const chartStatisticsNames = statistics.map(x => x.category.name);

    // const chartLimitAmount = statistics.map(x => x.limit);
    // const chartLimitNames = statistics.map(x => x.category.name);
    const chartExpenseAmount = statistics.map(x => x.amount);
    const chartExpenseNames = statistics.map(x => x.category.name);

    const chartLimitAmount = limits.map(x => x.amount);
    const chartLimitNames = limits.map(x => x.expensesCategory.name);

    useEffect(() => {
        const calculateSavings = () => {
            if ((incomeSum - expenseSum) > 0) {
                setSavings(Math.round(((incomeSum - expenseSum) + Number.EPSILON) * 100) / 100)
            } else
                setSavings(0);
        };
        calculateSavings();
    }, [incomeSum, expenseSum]);

    const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    const chartIncomeColors = [];
    const chartIncomeColorsBorder = [];
    const chartStatisticsColors = [];
    const chartStatisticsColorsBorder = [];
    const chartLimitColors = [];
    const chartLimitColorsBorder = [];

    // Generates random RGB values for the displayed incomes
    for (let i = 1; i <= chartIncomeNames.length; i++) {
        const r = randomBetween(0, 200);
        const g = randomBetween(0, 200);
        const b = randomBetween(0, 200);
        const rgb = `rgb(${r}, ${g}, ${b}, 0.4)`; // Collect all to a css color string
        const rgbBorder = `rgb(${r}, ${g}, ${b}, 1)`;

        chartIncomeColors.push(rgb);
        chartIncomeColorsBorder.push(rgbBorder);
    }

    for (let i = 1; i <= chartStatisticsNames.length; i++) {
        const r = randomBetween(0, 200);
        const g = randomBetween(0, 200);
        const b = randomBetween(0, 200);
        const rgb = `rgb(${r}, ${g}, ${b}, 0.4)`; // Collect all to a css color string
        const rgbBorder = `rgb(${r}, ${g}, ${b}, 1)`;

        chartStatisticsColors.push(rgb);
        chartStatisticsColorsBorder.push(rgbBorder);
    }

    for (let i = 1; i <= chartLimitNames.length; i++) {
        const r = randomBetween(0, 200);
        const g = randomBetween(0, 200);
        const b = randomBetween(0, 200);
        const rgb = `rgb(${r}, ${g}, ${b}, 0.4)`; // Collect all to a css color string
        const rgbBorder = `rgb(${r}, ${g}, ${b}, 1)`;

        chartLimitColors.push(rgb);
        chartLimitColorsBorder.push(rgbBorder);
    }

    // Fetch all user's income from database to display down below
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await fetch(`http://localhost:8080/api/income/user/${currentUser.id}`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${currentUser.accessToken}`
    //                 }
    //             });

    //         const data = await response.json();
    //         setIncome(data);
    //     };

    //     fetchData();
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:8080/api/statistics/user/income/${currentUser.id}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentUser.accessToken}`
                    }
                });

            const data = await response.json();
            setIncomes(data);
        };

        fetchData();
    }, []);


    ChartJS.register(ArcElement, Tooltip, Legend);
    const data = {
        labels: chartIncomeNames,
        datasets: [
            {
                label: 'Šio mėnesio pajamos:',
                data: chartIncomeAmount,
                backgroundColor: chartIncomeColors,
                borderColor: chartIncomeColorsBorder,
                borderWidth: 1,
            },
        ],
    };

    useEffect(() => {
        const fetchStatitics = async () => {
            const response = await fetch(`http://localhost:8080/api/statistics/user/${currentUser.id}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentUser.accessToken}`
                    }
                });

            const data = await response.json();
            setStatistics(data);
        };

        fetchStatitics();
    }, []);

    ChartJS.register(ArcElement, Tooltip, Legend);
    const expenseData = {
        labels: chartStatisticsNames,
        datasets: [
            {
                label: 'Šio mėnesio išlaidos:',
                data: chartStatisticsAmount,
                backgroundColor: chartStatisticsColors,
                borderColor: chartStatisticsColorsBorder,
                borderWidth: 1,
            },
        ],

    };


    useEffect(() => {
        const fetchLimits = async () => {
            const response = await fetch(`http://localhost:8080/api/limits/user/${currentUser.id}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentUser.accessToken}`
                    }
                });

            const data = await response.json();
            setLimits(data);
        };

        fetchLimits();
    }, []);

    // ChartJS.register(ArcElement, Tooltip, Legend);
    // const limitsData = {
    //     labels: chartLimitNames,
    //     datasets: [
    //         {
    //             label: 'Limitai:',
    //             data: chartLimitAmount,
    //             backgroundColor: chartLimitColors,
    //             borderColor: chartLimitColorsBorder,
    //             borderWidth: 1,
    //         },
    //     ],
    // };

    return (
        <>
            <div className="container-fluid budget__expense sticky-config">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h2>Statistika</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <main className="content">
                    <div className="container-fluid p-0">
                        <div className="row">
                            <div className="col-xl-6 col-xxl-5 d-flex">
                                <div className="w-100">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col mt-0">
                                                            <h5 className="card-title">Likutis</h5>
                                                        </div>

                                                        <div className="col-auto">
                                                            <div className="stat text-primary">
                                                                <i className="align-middle" data-feather="truck"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h1 className="mt-2 mb-2">{savings} €</h1>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col mt-0">
                                                            <h5 className="card-title">Pajamos</h5>
                                                        </div>

                                                        <div className="col-auto">
                                                            <div className="stat text-primary">
                                                                <i className="align-middle" data-feather="users"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h1 className="mt-2 mb-2">{incomeSum} €</h1>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col mt-0">
                                                            <h5 className="card-title">Pajamų likutis išlaidoms, %</h5>
                                                        </div>

                                                        <div className="col-auto">
                                                            <div className="stat text-primary">
                                                                <i className="align-middle" data-feather="dollar-sign"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ProgressBar completed={
                                                        Math.round((savings) / ((incomeSum)) * 100)
                                                    } maxCompleted={100}
                                                        bgColor="#008F8C"
                                                        className="mt-3 mb-1" />
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col mt-0">
                                                            <h5 className="card-title">Išlaidos</h5>
                                                        </div>

                                                        <div className="col-auto">
                                                            <div className="stat text-primary">
                                                                <i className="align-middle" data-feather="shopping-cart"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h1 className="mt-2 mb-2">{expenseSum} €</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-6 col-xxl-7">
                                <div className="card flex-fill w-100">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Limitai</h5>
                                    </div>
                                    <div className="card-body py-3">


                                        {statistics.map((categoryStatistics) => {
                                            if (categoryStatistics.limit !== 0) {
                                                return (
                                                    <div key={uuid()}>
                                                        <div className='row'>
                                                            <div className='col-8'>
                                                                <p className='mb-pb-fix'>{categoryStatistics.category.name}</p>
                                                            </div>
                                                            <div className='col-4'>
                                                                <p style={{ textAlign: "end" }} className="mb-pb-fix">({categoryStatistics.limit}€)</p>
                                                            </div>
                                                        </div>

                                                        <ProgressBar
                                                            completed={Math.round((categoryStatistics.amount) / (categoryStatistics.limit) * 100)}
                                                            maxCompleted={100}

                                                            bgColor={(Math.round((categoryStatistics.amount) / (categoryStatistics.limit) * 100) < 100) ? "#008F8C" : "#e84d4d"}
                                                        />
                                                    </div>
                                                )
                                            }
                                        })}

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-6 col-xxl-3 d-flex order-2 order-xxl-3">
                                <div className="card flex-fill w-100">
                                    <div className="card-header">

                                        <h5 className="card-title mb-0">Einamojo mėnesio išlaidos (kategorijos)</h5>
                                    </div>
                                    <div className="card-body d-flex">
                                        <div className="align-self-center w-100">
                                            <Doughnut
                                                data={expenseData}
                                                width={400}
                                                height={400}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: {
                                                            position: 'right'
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-xxl-3 d-flex order-1 order-xxl-1">
                                <div className="card flex-fill">
                                    <div className="card-header">

                                        <h5 className="card-title mb-0">Einamojo mėnesio pajamos</h5>
                                    </div>
                                    <div className="card-body d-flex">
                                        <div className="align-self-center w-100">
                                            <Doughnut
                                                data={data}
                                                width={400}
                                                height={400}
                                                options={{
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: {
                                                            position: 'right'
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>


                {/* </div> */}
                {/* </div> */}
            </div>
        </>
    );
}
