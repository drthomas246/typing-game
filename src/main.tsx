import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import { Provider } from "@/components/ui/provider";
import PageProvider from "@/contexts/PageProvider";

const el = document.getElementById("root");
if (!(el instanceof HTMLElement)) {
	throw new Error('Root element "#root" not found');
}

ReactDOM.createRoot(el).render(
	<React.StrictMode>
		<Provider>
			<PageProvider>
				<App />
			</PageProvider>
		</Provider>
	</React.StrictMode>,
);
