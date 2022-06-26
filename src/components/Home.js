import React from "react";
import "./Home.css"

const Home = () => {
    return (
        <>

            <div className="container mt-custom box-shadow bg-white">
                <div className="row">
                    <div className="">
                        <div className="col-11 col-md-11 bg-white second_section container">
                            <div className="row">
                                <div className="row ss_header">
                                    <div className="col-4">
                                        <div>First block</div>
                                    </div>
                                    <div className="col-4">
                                        <div>Second block</div>
                                    </div>
                                    <div className="col-4">
                                        <div>Third block</div>
                                    </div>
                                </div>
                                <div className="row ss_content">
                                    <div className="col-4">
                                        <div>Fourth block</div>
                                    </div>
                                    <div className="col-4">
                                        <div>Fifth block</div>
                                    </div>
                                    <div className="col-4">
                                        <div>Sixth block</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="container">
                        <div className="col-11 col-md-11 bg-white third_section container">
                            <div className="row">
                                <div className="col-4 ss_header">Seventh block</div>
                                <div className="col-8 ss_content">Eighth block</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};
export default Home;
