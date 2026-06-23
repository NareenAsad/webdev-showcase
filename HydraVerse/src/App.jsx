import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Table from './components/Table';
import Card from './components/Card';
import Services from './components/Services';
import Contact from './components/Contact';
import usersData from './assets/user.json';
import postsData from './assets/post.json';

function App() {
  const displayedPosts = postsData.slice(0, 6);
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="flex flex-col min-h-screen bg-[#1e1b32] w-full overflow-x-hidden">
            <Header />
            <main className="flex-grow">
              <Hero />
              {/* Posts Cards Section */}
              <section id="articles" className="py-12 px-4 mx-auto max-w-screen-xl">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold tracking-tight text-white">Latest Articles</h2>
                  <p className="mt-4 text-gray-400">Read our most recent publications.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                  {displayedPosts.map((post) => (
                    <Card
                      key={post.id}
                      title={post.title}
                      body={post.body}
                    />
                  ))}
                </div>
              </section>
              {/* Services Section */}
              <Services />
              {/* Users Table Section */}
              <section id="community" className="py-12 px-4 mx-auto max-w-screen-xl">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold tracking-tight text-white">Our Community</h2>
                  <p className="mt-4 text-gray-400">Meet the users driving our platform forward.</p>
                </div>
                <Table users={usersData} />
              </section>
              {/* Contact Section */}
              <Contact />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;