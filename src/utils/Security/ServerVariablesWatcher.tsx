// // import { useEffect } from "react";
// // import { useGetServerVariablesQuery } from "../../services/redux/apis/auth";
// // import { useLocation } from "react-router-dom";

// // const ServerVariablesWatcher = () => {
// //     const [getServerVariables,{ data, isLoading, error, refetch }] = useGetServerVariablesQuery();
// //   const location = useLocation();
// //   useEffect(() => {
// //     const fetchServerVars = async () => {
// //         const res = await getServerVariables();
// //         // if (res && typeof res === "object") {
// //         //  dispatch(SET_SERVER_VARIABLES(res));
// //         //   saveServerVariablesToCookie(res);
// //         // }
// //     };
// //     fetchServerVars();
// //   }, [location.pathname]); 

// //   return null; 
// // };

// // export default ServerVariablesWatcher;

// // components/ServerVariablesWatcher.tsx
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useLocation } from "react-router-dom";
// // import { useGetServerVariablesQuery } from "../../services/redux/apis/auth";
// import { saveServerVariablesToCookie } from "./server";
// import { INCREMENT_SERVER_FETCH_COUNT, SET_SERVER_VARIABLES } from "../../services/redux/slice/routeSlice";
// import { useServerVariablesQuery } from "../../services/redux/apis/authApi";

// const ServerVariablesWatcher = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const [ServerVariables, { data, isLoading, error }] = useServerVariablesQuery();

//  useEffect(() => {
//     const fetchServerVars = async () => {
//       try {
//         // Increment fetch count when starting
//         dispatch(INCREMENT_SERVER_FETCH_COUNT());
        
//         // Trigger the API call
//         const result = {};
        
//         if (result && typeof result === "object") {
//           // Dispatch to Redux store
//           dispatch(SET_SERVER_VARIABLES(result));
          
//           // Save to cookie with encryption
//           saveServerVariablesToCookie(result);
          
//           console.log("✅ Server variables fetched and stored:", result);
//         }
//       } catch (err) {
//         console.error("❌ Failed to fetch server variables:", err);
//       }
//     };

//     fetchServerVars();
//   }, [location.pathname, dispatch, triggerGetServerVariables]); 

//   // Optional: Add loading/error indicators
//   if (isLoading) {
//     console.log("🔄 Fetching server variables...");
//   }
  
//   if (error) {
//     console.error("❌ Server variables fetch error:", error);
//   }

//   return null; 
// };

// export default ServerVariablesWatcher;


// components/ServerVariablesWatcher.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useGetServerVariablesQuery } from "../../services/redux/apis/authApi";
import { INCREMENT_SERVER_FETCH_COUNT, SET_SERVER_VARIABLES } from "../../services/redux/slice/routeSlice";
import { saveServerVariablesToCookie } from "./server";


const ServerVariablesWatcher = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    
    // ✅ Correct usage - object destructuring for query hook
    const { data, isLoading, error, refetch } = useGetServerVariablesQuery();

    useEffect(() => {
        const fetchServerVars = async () => {
            try {
                // Increment fetch count when starting
                dispatch(INCREMENT_SERVER_FETCH_COUNT());
                
                // If you need to manually refetch on location change
                if (!data) {
                    const result = await refetch();
                    if (result.data) {
                        dispatch(SET_SERVER_VARIABLES(result.data));
                        saveServerVariablesToCookie(result.data);
                        console.log("✅ Server variables updated:", result.data);
                    }
                } else if (data) {
                    // If data is already available from initial load
                    dispatch(SET_SERVER_VARIABLES(data));
                    saveServerVariablesToCookie(data);
                    console.log("✅ Server variables loaded:", data);
                }
            } catch (err) {
                console.error("❌ Failed to fetch server variables:", err);
            }
        };

        fetchServerVars();
    }, [location.pathname, dispatch, refetch, data]); 

    // // Logging for debugging
    // if (isLoading) {
    //     console.log("🔄 Fetching server variables...");
    // }
    
    // if (error) {
    //     console.error("❌ Server variables fetch error:", error);
    // }

    return null;
};

export default ServerVariablesWatcher;