import { useState, useEffect, useRef } from 'react';

import { Button } from './Button';
import { ImageGallery } from './ImageGallery';
import { Searchbar } from './SearchBar';
import { Loader } from './Loader';

import { GlobalStyle } from 'styles/GlobalStyle';
import { Container } from './Container.styled';

import { fetchImgs, isLastPages } from 'services/api-pixabay';
import { Modal } from './Modal';
import { ToastContainer } from 'react-toastify';

export const App = () => {
  const isMounted = useRef(false);

  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(0);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (isMounted.current) {
      fetchNewImgs(query, page);
    }

    isMounted.current = true;
  }, [page, query]);

  useEffect(() => {
    showModalNewWindow(showModal);
  }, [showModal, images]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
    setShowModal(document.documentElement.showModal - 150);
  };

  const handleQuery = query => {
    setQuery(prevQuery => {
      if (prevQuery !== query) {
        setPage(1);
        setImages([]);
        setError('');
        setShowModal(0);
        return query;
      }
    });
  };

  const fetchNewImgs = async (query = '', page = 1) => {
    try {
      setIsLoading(true);

      const respImgs = await fetchImgs(query, page);

      if (respImgs.length === 0 || respImgs.length === '') {
        throw new Error(`No results were found for ${query}...`);
      }

      const newImages = respImgs.map(
        ({ id, webformatURL, largeImageURL, tags }) => ({
          id,
          webformatURL,
          largeImageURL,
          tags,
        })
      );

      setImages(prevImages => [...prevImages, ...newImages]);
      setIsLastPage(isLastPages());
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (largeImageURL, tags) => {
    setLargeImageURL(largeImageURL);
    setTags(tags);
  };

  const closeModal = () => {
    setLargeImageURL('');
  };

  const showModalNewWindow = showModal => {
    window.scrollTo({
      top: showModal,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Searchbar handleQuery={handleQuery} />
        {error !== '' && <p className="message">{error}</p>}
        {error === '' && <ImageGallery imgs={images} openModal={openModal} />}
        {isLoading && <Loader />}
        {!isLoading &&
          error === '' &&
          (isLastPage ? (
            <p className="noContent">No more content</p>
          ) : (
            images.length !== 0 && <Button handleClick={handleLoadMore} />
          ))}
        {largeImageURL && (
          <Modal
            onClose={closeModal}
            largeImageURL={largeImageURL}
            tags={tags}
          />
        )}
        <ToastContainer autoClose={3000} />
      </Container>
    </>
  );
};
