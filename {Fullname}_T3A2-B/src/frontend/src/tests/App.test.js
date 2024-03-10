import { render} from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router';
import { ApiProvider } from '../contexts/ApiProvider';

test('renders app without crashing', () => {
  render(
    <MemoryRouter>
      <ApiProvider>
        <App />
      </ApiProvider>   
    </MemoryRouter>
  );
});
