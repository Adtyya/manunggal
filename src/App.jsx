import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// layouts
import Auth from "@/views/Auth";
import AuthCover from "@/views/AuthCover";
import AuthIlustration from "@/views/AuthIlustration";
import Landing from "@/views/Landing";
import Maintenance from "@/views/Maintenance";
import Docs from "@/documentation/Docs";
import AdminCompact from "@/views/AdminCompact";
import AdminSidedark from "@/views/AdminSidedark";
import SignIn from "./views/auth/SignIn";
import RootAdmin from "./views/RootAdmin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* add routes with layouts */}
        <Route exact path="/sign-in" element={<SignIn />} />
        {/* <Route exact path="/dashboard/*" element={<RootAdmin />} /> */}

        <Route path="/dashboard/*" element={<RootAdmin />} />
        <Route path="/compact/*" element={<AdminCompact />} />
        <Route path="/side-dark/*" element={<AdminSidedark />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/auth2/*" element={<AuthCover />} />
        <Route path="/auth3/*" element={<AuthIlustration />} />
        <Route path="/landing-page/*" element={<Landing />} />
        <Route path="/maintenance/*" element={<Maintenance />} />

        {/* documentation  */}
        <Route path="/docs/*" element={<Docs />} />

        {/* add redirect for first page */}
        <Route
          path="*"
          element={<Navigate to="/dashboard/main" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}
