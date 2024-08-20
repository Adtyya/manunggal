import React from "react";
import { Routes, Route } from "react-router-dom";

import RoleBasedGuard from "../guards/RoleBaseGuard";

// import layout admin
import RootLayout from "@/layouts/RootLayout";

// Import App
import {
  VisitorList,
  CreateVisitor,
  EditVisitor,
  DetailVisitor,
} from "./visitors";
import { PendingVisitorList } from "./visitors-pending";
import { ScanPage } from "./scan";
import { TicketList, CreateTicket, EditTicket } from "./tickets";
import { ReplaceBanner } from "./banner";
import { OrderList, CreateOrder, EditOrder } from "./orders";
import { ProductList, CreateProduct, EditProduct } from "./products";
import { VariantList, CreateVariant, EditVariant } from "./variants";
import { BlogList, CreateBlog, EditBlog } from "./blogs";
import {
  CollectionList,
  CreateCollection,
  EditCollection,
} from "./collections";
import { CreateUser, EditUser, UserList } from "./user";
import MainDashboard from "./maindashboard/dashboard";
import { Agents, CreateAgent, EditAgent } from "./agent";
import { CreateCustomer, Customer, EditCustomer } from "./customer";
import { CreateProductM, EditProductM, Product } from "./product";
import {
  CreateSalesContract,
  EditSalesContract,
  SalesContract,
} from "./salesContract";
import { CreateSalesOrder, EditSalesOrder, SalesOrder } from "./salesOrder";

export default function RootAdmin() {
  return (
    <RootLayout>
      <Routes>
        <Route
          exact
          path="/main"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <MainDashboard />
            </RoleBasedGuard>
          }
        />

        <Route
          exact
          path="/list-visitors"
          element={
            <RoleBasedGuard
              hasContent
              roles={["super admin", "admin", "front office"]}
            >
              <VisitorList />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/create-visitor"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <CreateVisitor />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/edit-visitor/:id"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <EditVisitor />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/view-visitor/:id"
          element={
            <RoleBasedGuard
              hasContent
              roles={["super admin", "admin", "front office"]}
            >
              <DetailVisitor />
            </RoleBasedGuard>
          }
        />

        <Route
          exact
          path="/list-pending-visitors"
          element={
            <RoleBasedGuard
              hasContent
              roles={["super admin", "admin", "front office"]}
            >
              <PendingVisitorList />
            </RoleBasedGuard>
          }
        />

        <Route
          exact
          path="/scan-qr"
          element={
            <RoleBasedGuard
              hasContent
              roles={["super admin", "admin", "front office"]}
            >
              <ScanPage />
            </RoleBasedGuard>
          }
        />

        <Route
          exact
          path="/list-tickets"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <TicketList />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/create-ticket"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <CreateTicket />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/edit-ticket/:id"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <EditTicket />
            </RoleBasedGuard>
          }
        />

        <Route
          exact
          path="/list-banners"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <ReplaceBanner />
            </RoleBasedGuard>
          }
        />

        <Route
          exact
          path="/list-orders"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <OrderList />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/create-order"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <CreateOrder />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/edit-order/:id"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <EditOrder />
            </RoleBasedGuard>
          }
        />

        <Route
          exact
          path="/list-products"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <ProductList />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/create-product"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <CreateProduct />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/edit-product/:id"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <EditProduct />
            </RoleBasedGuard>
          }
        />

        <Route
          exact
          path="/list-variants"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <VariantList />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/create-variant"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <CreateVariant />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/edit-variant/:id"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <EditVariant />
            </RoleBasedGuard>
          }
        />

        <Route
          exact
          path="/list-blogs"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <BlogList />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/create-blog"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <CreateBlog />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/edit-blog/:id"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <EditBlog />
            </RoleBasedGuard>
          }
        />

        <Route
          exact
          path="/list-collections"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <CollectionList />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/create-collection"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <CreateCollection />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/edit-collection/:id"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <EditCollection />
            </RoleBasedGuard>
          }
        />

        <Route
          exact
          path="/list-users"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <UserList />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/create-user"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <CreateUser />
            </RoleBasedGuard>
          }
        />
        <Route
          exact
          path="/edit-user/:id"
          element={
            <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
              <EditUser />
            </RoleBasedGuard>
          }
        />

        <Route exact path="/list-agent" element={<Agents />} />
        <Route exact path="/create-agent" element={<CreateAgent />} />
        <Route exact path="/edit-agent/:id" element={<EditAgent />} />

        <Route exact path="/list-customer" element={<Customer />} />
        <Route exact path="/create-customer" element={<CreateCustomer />} />
        <Route exact path="/edit-customer/:id" element={<EditCustomer />} />

        <Route exact path="/list-product" element={<Product />} />
        <Route exact path="/m/create-product" element={<CreateProductM />} />
        <Route exact path="/m/edit-product/:id" element={<EditProductM />} />

        <Route exact path="/list-sales-contract" element={<SalesContract />} />
        <Route
          exact
          path="/create-sales-contract"
          element={<CreateSalesContract />}
        />
        <Route
          exact
          path="/edit-sales-contract/:id"
          element={<EditSalesContract />}
        />

        <Route exact path="/list-sales-order" element={<SalesOrder />} />
        <Route
          exact
          path="/create-sales-order"
          element={<CreateSalesOrder />}
        />
        <Route
          exact
          path="/edit-sales-order/:id"
          element={<EditSalesOrder />}
        />
      </Routes>
    </RootLayout>
  );
}
