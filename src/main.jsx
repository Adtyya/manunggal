import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider, QueryClient } from "react-query";

// auth and routing
import App from "@/App";

// Styles
import "@/assets/css/app.css";
import "easymde/dist/easymde.min.css";
import "react-date-picker/dist/DatePicker.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

const query = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={query}>
    <App />
  </QueryClientProvider>
);
