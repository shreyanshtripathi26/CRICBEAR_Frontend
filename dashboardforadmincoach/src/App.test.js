import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import App from './App';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CoachDashboard from './components/CoachDashboard';
import TournamentManagement from './components/TournamentManagement';
import ManageUser from "./components/ManageUser";
import ManageMatch from "./components/ManageMatch";
import RegisterTournament from "./components/RegisterTournament";
import CreatePlayer from "./components/CreatePlayer";
import ManageTeam from "./components/ManageTeam";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Routing', () => {

    it('renders AdminDashboard for /admin route when user is admin', () => {
      localStorage.setItem('user', JSON.stringify({ role: 'ADMIN' }));
      renderWithRouter(<AuthProvider><App /></AuthProvider>, { route: '/admin' });
      expect(screen.getByText('Welcome, Admin')).toBeInTheDocument();
    });

    it('renders CoachDashboard for /coach route when user is coach', () => {
      localStorage.setItem('user', JSON.stringify({ role: 'COACH' }));
      renderWithRouter(<AuthProvider><App /></AuthProvider>, { route: '/coach' });
      expect(screen.getByText('Welcome, Coach')).toBeInTheDocument();
    });
  });

  describe('Protected Routes', () => {
    it('renders TournamentManagement for /admin/TournamentManagement route when user is admin', () => {
      localStorage.setItem('user', JSON.stringify({ role: 'ADMIN' }));
      renderWithRouter(<AuthProvider><App /></AuthProvider>, { route: '/admin/ManageMatch' });
      expect(screen.getByText('Manage Match')).toBeInTheDocument();
    });

    it('renders ManageUser for /admin/ManageUser route when user is admin', () => {
      localStorage.setItem('user', JSON.stringify({ role: 'ADMIN' }));
      renderWithRouter(<AuthProvider><App /></AuthProvider>, { route: '/admin/ManageMatch' });
      expect(screen.getByText('Manage Match')).toBeInTheDocument();
    });

    it('renders ManageMatch for /admin/ManageMatch route when user is admin', () => {
      localStorage.setItem('user', JSON.stringify({ role: 'ADMIN' }));
      renderWithRouter(<AuthProvider><App /></AuthProvider>, { route: '/admin/ManageMatch' });
      expect(screen.getByText('Manage Match')).toBeInTheDocument();
    });
  });
});

describe('AdminDashboard Component', () => {
  it('renders correctly', () => {
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
    expect(screen.getByText('Welcome, Admin')).toBeInTheDocument();
    expect(screen.getByText('Tournament Management')).toBeInTheDocument();
    expect(screen.getByText('Manage User')).toBeInTheDocument();
    expect(screen.getByText('Manage Match')).toBeInTheDocument();
  });

  it('handles logout', () => {
    const navigate = jest.fn();
    useNavigate.mockImplementation(() => navigate); 
  
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
  
    fireEvent.click(screen.getByText('Logout'));
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});

describe('CoachDashboard Component', () => {
  it('renders correctly', () => {
    render(<MemoryRouter><CoachDashboard /></MemoryRouter>);
    expect(screen.getByText('Welcome, Coach')).toBeInTheDocument();
    expect(screen.getByText('Register Tournament')).toBeInTheDocument();
    expect(screen.getByText('Create Player')).toBeInTheDocument();
    expect(screen.getByText('Manage Team')).toBeInTheDocument();
  });

  it('handles logout', () => {
    const navigate = jest.fn();
    useNavigate.mockImplementation(() => navigate); 
  
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
  
    fireEvent.click(screen.getByText('Logout'));
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});

describe('RegisterTournament Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ uid: '123', role: 'COACH' }));
  });

  it('renders correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [{ teamId: '1', coachId: '123' }] });
    render(<MemoryRouter><RegisterTournament /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Register for Tournament')).toBeInTheDocument();
    });
  });

  it('fetches tournaments and teams on mount', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [{ teamId: '1', coachId: '123' }] });
    render(<MemoryRouter><RegisterTournament /></MemoryRouter>);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8084/tournament/getAll');
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8084/team/getAll');
    });
  });
});

describe('ManageTeam Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ uid: '123', role: 'COACH' }));
  });

  it('fetches players and teams on mount', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<MemoryRouter><ManageTeam /></MemoryRouter>);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8084/player/getAll');
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8084/team/getAll');
    });
  });
});

describe('ManageUser Component', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ uid: '123', role: 'ADMIN' }));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<MemoryRouter><ManageUser /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Manage Users')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search users by first or last name...')).toBeInTheDocument();
    });
  });

  it('fetches users on mount', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ uid: '1', firstName: 'John', lastName: 'Doe', role: 'COACH' }] });
    render(<MemoryRouter><ManageUser /></MemoryRouter>);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8083/user/all');
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('handles user search', async () => {
    axios.get.mockResolvedValueOnce({ data: [
      { uid: '1', firstName: 'John', lastName: 'Doe', role: 'COACH' },
      { uid: '2', firstName: 'Jane', lastName: 'Smith', role: 'ADMIN' }
    ] });
    render(<MemoryRouter><ManageUser /></MemoryRouter>);
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search users by first or last name...');
      fireEvent.change(searchInput, { target: { value: 'John' } });
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('handles coach role change and save', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ uid: '1', firstName: 'John', lastName: 'Doe', role: 'COACH' }] });
    axios.get.mockResolvedValueOnce({ data: { uid: '1', firstName: 'John', lastName: 'Doe', role: 'COACH' } });
    axios.put.mockResolvedValueOnce({ data: { success: true } });
    render(<MemoryRouter><ManageUser /></MemoryRouter>);
    await waitFor(() => {
      fireEvent.click(screen.getByText('MANAGE'));
      const roleSelect = screen.getByLabelText('Assign Role:');
      fireEvent.change(roleSelect, { target: { value: 'ADMIN' } });
      fireEvent.click(screen.getByText('Save'));
      expect(axios.put).toHaveBeenCalledWith('http://localhost:8083/user/setUserRole/1', { role: 'ADMIN' });
    });
  });

  it('handles admin role change and save', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ uid: '2', firstName: 'Ritik', lastName: 'Seth', role: 'ADMIN' }] });
    axios.get.mockResolvedValueOnce({ data: { uid: '2', firstName: 'Ritik', lastName: 'Seth', role: 'ADMIN' } });
    axios.put.mockResolvedValueOnce({ data: { success: true } });
    render(<MemoryRouter><ManageUser /></MemoryRouter>);
    await waitFor(() => {
      fireEvent.click(screen.getByText('MANAGE'));
      const roleSelect = screen.getByLabelText('Assign Role:');
      fireEvent.change(roleSelect, { target: { value: 'COACH' } });
      fireEvent.click(screen.getByText('Save'));
      expect(axios.put).toHaveBeenCalledWith('http://localhost:8083/user/setUserRole/2', { role: 'COACH' });
    });
  });

  it('handles error when fetching users', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch users'));
    render(<MemoryRouter><ManageUser /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch users')).toBeInTheDocument();
    });
  });
});