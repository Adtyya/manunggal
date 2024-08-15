import React from "react";
import parse from 'html-react-parser';
import { Row, Column, Card, Preloader } from "@/components/reactdash-ui";
import useInformationUser from "@/components/global/useInformationUser";

export default function RoleBasedGuard({ hasContent, roles, children }) {
    // Logic here to get current user role
    const hook = useInformationUser();

    // const currentRole = 'user';
    const currentRole = hook?.role; // admin;

    const data_notfound = {
        title: `Access Denied`,
        description: "You don't have permission to access this page.",
        img: "/img/ilustration/404.png",
    }

    if (typeof roles !== 'undefined' && !roles.includes(currentRole)) {
        return hasContent ? (
            <Preloader>
                <Row>
                    <Column className="w-full px-4">
                        <Card className="relative p-8 md:p-12 mb-6">
                            <div className="relative">
                                <header className="text-center mx-auto mb-6">
                                    <h1 className="text-4xl leading-normal mb-2 font-bold text-gray-800 dark:text-gray-300">
                                        {parse(data_notfound.title)}
                                    </h1>
                                    <hr className="block w-12 h-0.5 mx-auto my-5 bg-indigo-500 border-indigo-500" />
                                    <p className="text-gray-500 leading-relaxed font-light text-xl mx-auto pb-2">{data_notfound.description}</p>
                                </header>

                                <div className="relative text-center">
                                    <img src={data_notfound.img} className="w-1/2 max-w-full h-auto mx-auto mb-6" alt="404 Not found" />
                                </div>
                            </div>
                        </Card>
                    </Column>
                </Row>
            </Preloader>
        ) : null;
    }

    return <>{children}</>;
}