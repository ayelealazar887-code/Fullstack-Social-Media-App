import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { CreatePostPage } from "./pages/createPostPage";
import { PostPage } from "./pages/PostPage";

function App() {
  return (
    <div>
      <Navbar />

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;