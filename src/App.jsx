import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    // Generate sample books randomly assigned to genres
    const sampleGenres = [
      "Horror",
      "Action",
      "Romance",
      "Sci-Fi",
      "Fantasy",
      "Mystery",
      "Thriller",
      "Biography",
      "History",
      "Self-Help",
      "Comedy",
    ];

    const sampleTitles = [
      "The Silent Shadows",
      "Galactic Wars",
      "Love in the Rain",
      "Time Travelers",
      "Dragon's Quest",
      "The Lost Key",
      "Heart of Darkness",
      "Einstein's Life",
      "Ancient Empires",
      "Mind Mastery",
      "Laugh Out Loud",
      "Ghostly Tales",
      "Hero's Journey",
      "Passionate Hearts",
      "Alien Invasion",
      "Magical Realms",
      "Whodunit Mystery",
      "Edge of Suspense",
      "Famous Lives",
      "World History",
      "Self Improvement",
      "Comedy Central",
      "Haunted House",
      "Action Packed",
      "Romantic Getaway",
      "Sci-Fi Adventures",
      "Fantasy Worlds",
      "Detective Stories",
      "Thrilling Escapes",
      "Biographical Tales",
      "Historical Events",
      "Personal Growth",
      "Funny Moments",
      "Dark Secrets",
      "Epic Battles",
      "Forbidden Love",
      "Future Visions",
      "Enchanted Lands",
      "Puzzle Mysteries",
      "Suspense Thrillers",
      "Life Stories",
      "Past Chronicles",
      "Inner Peace",
      "Humor Hits",
    ];

    const generateSampleBooks = () => {
      const books = [];
      for (let i = 0; i < 200; i++) { // Increased to 200 sample books for fuller sections
        const genre = sampleGenres[Math.floor(Math.random() * sampleGenres.length)];
        const title = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
        const price = (Math.random() * 20 + 5).toFixed(2); // Random price between 5 and 25
        const rating = Math.floor(Math.random() * 5) + 1; // Random rating 1-5
        books.push({
          Title: `${title} ${i + 1}`, // Add number to make titles unique
          "Product Type": genre,
          Price: parseFloat(price),
          Rating: rating,
        });
      }
      return books;
    };

    // Uncomment the line below to use real data from books.json if available
    // axios.get("/books.json").then((res) => {
    //   const cleaned = res.data.map((b) => ({
    //     ...b,
    //     Price: parseFloat(String(b.Price).replace("£", "").replace("Â", "")),
    //     Rating: Number(b.Rating),
    //   }));
    //   setBooks(cleaned);
    // });

    // Use sample data for now
    setBooks(generateSampleBooks());
  }, []);

  // Predefined genres for a more professional and standardized approach
  const genres = useMemo(() => {
    return [
      "All",
      "Horror",
      "Action",
      "Romance",
      "Sci-Fi",
      "Fantasy",
      "Mystery",
      "Thriller",
      "Biography",
      "History",
      "Self-Help",
      "Comedy",
    ];
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter(
      (b) =>
        b.Title.toLowerCase().includes(search.toLowerCase()) &&
        (selectedGenre === "All" ||
          b["Product Type"].toLowerCase() === selectedGenre.toLowerCase())
    );
  }, [books, search, selectedGenre]);

  const totalBooks = filteredBooks.length;
  const avgPrice =
    totalBooks > 0
      ? filteredBooks.reduce((sum, b) => sum + b.Price, 0) / totalBooks
      : 0;
  const avgRating =
    totalBooks > 0
      ? filteredBooks.reduce((sum, b) => sum + b.Rating, 0) / totalBooks
      : 0;

  const ratingCounts = [1, 2, 3, 4, 5].map(
    (r) => filteredBooks.filter((b) => b.Rating === r).length
  );

  // Group books by genre for the genre section - now filtered by selectedGenre
  const booksByGenre = useMemo(() => {
    const grouped = {};
    if (selectedGenre === "All") {
      genres.forEach((genre) => {
        if (genre === "All") return;
        grouped[genre] = books.filter((b) => b["Product Type"] === genre).slice(0, 5); // Show up to 5 books per genre for preview
      });
    } else {
      grouped[selectedGenre] = books.filter((b) => b["Product Type"] === selectedGenre).slice(0, 10); // Show more books for selected genre
    }
    return grouped;
  }, [books, genres, selectedGenre]);

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <div style={styles.logo}>Book Intelligence</div>
        <input
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      {/* GENRE BUTTONS */}
      <div style={styles.genreContainer}>
        {genres.map((genre) => {
          const genreCount = genre === "All" ? books.length : books.filter(b => b["Product Type"].toLowerCase() === genre.toLowerCase()).length;
          return (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              style={{
                ...styles.genreButton,
                ...(selectedGenre === genre
                  ? styles.activeGenre
                  : {}),
              }}
            >
              {genre} ({genreCount})
            </button>
          );
        })}
      </div>

      {/* GENRE BOOKS SECTION - Now shows only selected genre or all */}
      <div style={styles.genreBooksSection}>
        <h3 style={styles.sectionTitle}>
          {selectedGenre === "All" ? "Books by Genre" : `${selectedGenre} Books`}
        </h3>
        <div style={styles.genreGrid}>
          {Object.entries(booksByGenre).map(([genre, genreBooks]) => (
            <div key={genre} style={styles.genreCard}>
              <h4 style={styles.genreTitle}>{genre}</h4>
              <ul style={styles.bookList}>
                {genreBooks.map((book, index) => (
                  <li key={index} style={styles.bookItem}>
                    {book.Title} - £{book.Price.toFixed(2)} ({book.Rating}★)
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={styles.kpiContainer}>
        <KPI title="Total Books" value={totalBooks} />
        <KPI title="Average Price" value={`£${avgPrice.toFixed(2)}`} />
        <KPI title="Average Rating" value={avgRating.toFixed(2)} />
      </div>

      {/* MAIN CONTENT: TABLE and CHART side by side */}
      <div style={styles.mainContent}>
        {/* TABLE - Even more room */}
        <div style={styles.tableCard}>
          <h3>Books</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Price</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, index) => (
                  <tr key={index} style={styles.row}>
                    <td>{book.Title}</td>
                    <td>{book["Product Type"]}</td>
                    <td>£{book.Price.toFixed(2)}</td>
                    <td>{book.Rating}★</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RATING CHART - Smaller */}
        <div style={styles.card}>
          <h3>Rating Distribution</h3>
          <Bar
            data={{
              labels: ["1★", "2★", "3★", "4★", "5★"],
              datasets: [
                {
                  label: "Books",
                  data: ratingCounts,
                  backgroundColor: "#2563eb", // Updated chart color to match new theme
                  borderRadius: 6,
                },
              ],
            }}
            options={{
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: {
                  ticks: { color: "#374151" }, // Dark text for light theme
                  grid: { display: false },
                },
                y: {
                  ticks: { color: "#374151" },
                  grid: { color: "rgba(0,0,0,0.05)" },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

function KPI({ title, value }) {
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiTitle}>{title}</div>
      <div style={styles.kpiValue}>{value}</div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #dbeafe, #bfdbfe, #93c5fd)", // Light blue gradient for stunning look
    color: "#1f2937", // Dark text for contrast
    fontFamily: "Inter, sans-serif",
    padding: "40px",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    color: "#1e40af", // Dark blue for logo
  },
  search: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#374151",
  },
  genreContainer: {
    marginBottom: "30px",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  genreButton: {
    padding: "8px 14px",
    borderRadius: "20px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#374151",
    cursor: "pointer",
  },
  activeGenre: {
    background: "#2563eb",
    border: "none",
    color: "#ffffff",
  },
  genreBooksSection: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#1f2937",
  },
  genreGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  genreCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #d1d5db",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  genreTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#1f2937",
  },
  bookList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  bookItem: {
    padding: "5px 0",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#6b7280",
  },
  kpiContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  kpiCard: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "16px",
    border: "1px solid #d1d5db",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  kpiTitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "8px",
  },
  kpiValue: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1f2937",
  },
  mainContent: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
  },
  card: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "16px",
    border: "1px solid #d1d5db",
    flex: 1,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  tableCard: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "16px",
    border: "1px solid #d1d5db",
    flex: 3,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  tableWrapper: {
    maxHeight: "400px",
    overflowY: "auto",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "12px 8px",
    textAlign: "left",
    background: "#f9fafb",
    color: "#374151",
    fontWeight: "600",
    borderBottom: "2px solid #e5e7eb",
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #e5e7eb",
  },
  row: {
    borderBottom: "1px solid #e5e7eb",
  },
};

export default App;