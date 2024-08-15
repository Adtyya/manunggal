import React, { useState, useEffect } from "react";
// components
import {
  Row,
  Column,
  Card,
  Button,
} from "@/components/reactdash-ui";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import QRCode from 'qrcode';
import { getVisitorsById } from "./service";
import { formatDateTime } from "@/utils/formatdate";

export default function DetailVisitor() {
  const param = useParams();

  const [image, setImage] = useState("");

  const { data: visit, isLoading } = useQuery(
    ["visitorById", { id: param.id }],
    getVisitorsById
  );

  useEffect(() => {
    if (visit) {
      QRCode.toDataURL(visit.visitId)
        .then(url => {
          setImage(url);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [visit])

  const bgStatus = (val) => {
    if (val === "pending") return "text-yellow-600";
    if (val === "cancel") return "text-red-600";
    if (val === "paid") return "text-green-600";
    return "text-gray-600";
  }

  const bgTicket = (val) => {
    if (val === "open") return "text-yellow-600";
    return "text-green-600";
  }

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Detail Visitor</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          <Card className="relative p-6">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                  <div>
                    {image && (
                      <img alt="Image" src={image} width="250" />
                    )}
                  </div>
                  <div className="flex flex-col gap-5 mt-6">
                    <div>
                      <h3>Ticket ID</h3>
                      <p className="font-bold">{visit.visitId}</p>
                    </div>
                    <div>
                      <h3>Event</h3>
                      <p className="font-bold">{visit.event}</p>
                    </div>
                    <div>
                      <h3>Visit Date</h3>
                      <p className="font-bold">{formatDateTime(visit.visitDate)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-5 mt-6">
                    <div>
                      <h3>Nama</h3>
                      <p className="font-bold">{visit.customer.name}</p>
                    </div>
                    <div>
                      <h3>Gender / Usia</h3>
                      <p className="font-bold capitalize">{visit.customer.gender} / {visit.customer.ageGroup}</p>
                    </div>
                    <div>
                      <h3>Email</h3>
                      <p className="font-bold font-bold">{visit.customer?.email || "-"}</p>
                    </div>
                    <div>
                      <h3>Telepon</h3>
                      <p className="font-bold">{visit.customer?.phone || "-"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-5 mt-6">
                    <div>
                      <h3>Status</h3>
                      <p className={`font-bold capitalize ${bgStatus(visit.status)}`}>
                        {visit.status}
                      </p>
                    </div>
                    <div>
                      <h3>Payment</h3>
                      <p className="font-bold capitalize">{visit?.payment || "-"}</p>
                    </div>
                    <div>
                      <h3>Ticket Status</h3>
                      <p className={`font-bold capitalize ${bgTicket(visit.ticketStatus)}`}>
                        {visit.ticketStatus}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end items-center space-x-3.5 mt-8">
                  <Link to="/dashboard/list-visitors">
                    <Button color="outline-gold">Back</Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </Column>
      </Row >
    </>
  );
}
