import { useEffect, useState } from "react";

interface Data{
  id: number; 
  author: string; 
  title: string; 
  year: number; 
  genre: string;
  pages: number;
  available: boolean;
}

function App() {
  const [data, setData] = useState<Data[]>([]);

  const [editingData, setEditingData] = useState<Data | null>(null);

  const [formState, setFormState] = useState({
    author: '', 
    title: '', 
    year: '',
    genre: '',
    pages: '',
    available: true,
  });

  const fetchData = async () => {

      const response = await fetch('http://localhost:5000/items');

      const result = await response.json();

      setData(result);
  };

  useEffect(() => {
    fetchData(); 
  }, []); 


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value} = e.target; 
    setFormState({ ...formState, [name]: value }); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if(editingData){
      await updateData(); 
    }else{
      await postData(); 
    }
  }


  const postData = async () => {
    const response = await fetch('http://localhost:5000/items', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({
        author: formState.author,
        title: formState.title, 
        year: parseInt(formState.year),
        genre: formState.genre,
        pages: parseInt(formState.pages),
        available: formState.available
      }),
    });
    if (response.ok) { 
      fetchData(); 
      resetForm(); 
    }
  };


  const editData = (item: Data) => {
    setEditingData(item); 
    setFormState({
      author: item.author,
      title: item.title, 
      year: item.year.toString(),
      genre: item.genre,
      pages: item.pages.toString(),
      available: item.available,
    });
  };


  const updateData = async () => {
    if (!editingData) return; 
    const response = await fetch(`http://localhost:5000/items/${editingData.id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: formState.author,
        title: formState.title,
        year: parseInt(formState.year),
        genre: formState.genre,
        pages: parseInt(formState.pages),
        available: formState.available,
      }),
    });
    if (response.ok) { 
      fetchData(); 
      resetForm(); 
    }
  };

  const deleteData = async (id: number) => {
    const response = await fetch(`http://localhost:5000/items/${id}`, { 
      method: 'DELETE', 
    });
    if (response.ok) { 
      await fetchData(); 
    }
  };

  const resetForm = () => {
    setFormState({ author: '', title: '', year: '', genre: '', pages: '', available: true }); 
    setEditingData(null); 
  };

  return (
    <>
      <h1>Bevásárlólista</h1>
      {}
      <form onSubmit={handleSubmit}>
          <label htmlFor="product">Termék:</label>
          <br />
          <input
            type="text"
            name="product" 
            id="product"
            value={formState.product} 
            onChange={handleInputChange} 
          />
          <br />
          <label htmlFor="amount">Mennyiség:</label>
          <br />
          <input
            type="number"
            name="amount" 
            id="amount"
            value={formState.amount} 
            onChange={handleInputChange} 
          />
          <br />
          <label htmlFor="unit">Egység:</label>
          <br />
          <input
            type="text"
            name="unit" 
            id="unit"
            value={formState.unit} 
            onChange={handleInputChange} 
          />
          <br /><br />
          {}
          <button type="submit">{editingData ? 'Módosítás' : 'Felvitel'}</button>
      </form>
      <br />
      {}
      <table>
        {}
        <tr>
          <th>Termék</th>
          <th>Mennyiség</th>
          <th>Egység</th>
          <th>Szerkesztés</th>
          <th>Törlés</th>
        </tr>
        {}
        {}
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.product}</td>
            <td>{item.amount}</td>
            <td>{item.unit}</td>
            {}
            <td><button onClick={() => editData(item)}>Szerkesztés</button></td>
            {}
            <td><button onClick={() => deleteData(item.id)}>Törlés</button></td>
          </tr>
        ))}
      </table>
    </>
  )
}

export default App