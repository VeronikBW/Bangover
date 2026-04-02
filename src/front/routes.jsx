// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Members } from "./pages/Members";
import { Rules } from "./pages/Rules";
import { Activities } from "./pages/Activities";
import { Login } from "./pages/Login";
import { AgnusDei } from "./pages/activities/AgnusDei";
import { Drabbles } from "./pages/activities/Drabbles";
import { Explicit } from "./pages/activities/Explicit";
import { Gallery } from "./pages/activities/Gallery";
import { Music } from "./pages/activities/Music";
import { NonSex } from "./pages/activities/NonSex";
import { Quotes } from "./pages/activities/Quotes";
import { Recordis } from "./pages/activities/Recordis";
import { SensibleContent } from "./pages/activities/SensibleContent";
import { Special } from "./pages/activities/Special";



export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/members" element={<Members />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/login" element={<Login />} />

      <Route path="/activities" element={<Activities />} />
      <Route path="/activities/agnus-dei" element={<AgnusDei />} />
      <Route path="/activities/drabbles" element={<Drabbles />} />
      <Route path="/activities/explicit" element={<Explicit />} />
      <Route path="/activities/gallery" element={<Gallery />} />
      <Route path="/activities/music" element={<Music />} />
      <Route path="/activities/non-sex" element={<NonSex />} />
      <Route path="/activities/quotes" element={<Quotes />} />
      <Route path="/activities/recordis" element={<Recordis />} />
      <Route path="/activities/sensible-content" element={<SensibleContent />} />
      <Route path="/activities/special" element={<Special />} />
    </Route>
  )
);