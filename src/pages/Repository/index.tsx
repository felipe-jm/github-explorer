import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronsLeft, FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import { Header, RepositoryInfo, Issues } from './styles';
import logoImg from '../../assets/logo.svg';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const [repoInfo, setRepoInfo] = useState<Repository | null>(null);
  const [repoIssues, setRepoIssues] = useState<Issue[]>([]);

  const { repository } = useParams();

  useEffect(() => {
    async function loadData(): Promise<void> {
      api.get(`repos/${repository}`).then((response) => {
        setRepoInfo(response.data);
      });

      api.get(`repos/${repository}/issues`).then((response) => {
        setRepoIssues(response.data);
      });
    }

    loadData();
  }, [repository]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" />
        <Link to="/">
          <FiChevronsLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repoInfo && (
        <RepositoryInfo>
          <header>
            <img src={repoInfo?.owner.avatar_url} alt={repoInfo.owner.login} />
            <div>
              <strong>{repoInfo.full_name}</strong>
              <p>{repoInfo.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repoInfo.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repoInfo.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repoInfo.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {repoIssues.map((issue) => (
          <a key={issue.id} href={issue.html_url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>

            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
