'use client';

import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Fab, Container, Card, CardContent, 
  Dialog, TextField, Button, DialogTitle, DialogContent, DialogActions, 
  Box, IconButton, CircularProgress, InputBase, Grid, Paper 
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Close as CloseIcon, VolumeUp, FlashOn } from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from 'graphql-tag';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAddModal, setSearch, RootState } from '../../lib/store';

// --- Types ---
interface Word {
  id: string;
  text: string;
  lexicalCategory: string;
  definition: string;
  example?: string;
  audioUrl?: string;
}

interface QueryData {
  getWords?: Word[];
  searchWords?: Word[];
}

// --- GraphQL ---
const GET_WORDS = gql`query GetWords { getWords { id text lexicalCategory definition example audioUrl } }`;
const SEARCH_WORDS = gql`query Search($q: String!) { searchWords(query: $q) { id text lexicalCategory definition example audioUrl } }`;
const ADD_WORD = gql`mutation Add($text: String!) { addWord(text: $text) { id text } }`;

export default function VocabApp() {
  const dispatch = useDispatch();
  const { isAddOpen, searchTerm } = useSelector((state: RootState) => state.ui);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [newWordText, setNewWordText] = useState('');

  const { data, loading, refetch } = useQuery<QueryData>(
    searchTerm ? SEARCH_WORDS : GET_WORDS, 
    { variables: { q: searchTerm }, fetchPolicy: "cache-and-network" }
  );
  
  const [addWord, { loading: adding }] = useMutation(ADD_WORD);

  const handleAdd = async () => {
    if (!newWordText) return;
    try {
      await addWord({ variables: { text: newWordText } });
      dispatch(toggleAddModal(false));
      setNewWordText('');
      refetch();
    } catch (e) {
      alert('Word not found in Oxford Dictionary');
    }
  };

  return (
    <>
      {/* HEADER - Matches the purple bar in your screenshot */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#5D1049' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '-0.5px' }}>
            Vocab
          </Typography>
          <SearchIcon sx={{ mr: 1, opacity: 0.8 }} />
          <InputBase
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.4)', width: '120px', fontSize: '0.9rem' }}
          />
        </Toolbar>
      </AppBar>

      {/* WORD LIST */}
      <Container sx={{ mt: 2, pb: 12 }}>
        <Typography variant="caption" sx={{ color: '#666', ml: 1, mb: 2, display: 'block', fontWeight: 500 }}>
          Words List
        </Typography>

        {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} /> : (
          <Grid container spacing={2}>
            {(data?.searchWords || data?.getWords)?.map((word: Word) => (
              <Grid size={{ xs: 12 }} key={word.id}>
                {/* CARD STYLING - Matches the white cards with specific text layout */}
                <Card 
                  elevation={0}
                  onClick={() => setSelectedWord(word)} 
                  sx={{ 
                    cursor: 'pointer', 
                    borderRadius: 3, 
                    mb: 1,
                    borderBottom: '1px solid #eee' // Subtle separator like in list views
                  }}
                >
                  <CardContent sx={{ pb: '16px !important', pl: 2, pr: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000' }}>
                      {word.text}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: '#444' }}>
                      <span style={{ fontStyle: 'italic', color: '#666', marginRight: 4 }}>
                        ({word.lexicalCategory})
                      </span> 
                      {word.definition}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* FAB - Matches the Red Button in your screenshot */}
      <Fab 
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24, 
          bgcolor: '#E30425', 
          '&:hover': { bgcolor: '#bf031f' } 
        }} 
        onClick={() => dispatch(toggleAddModal(true))}
      >
        <AddIcon sx={{ color: 'white' }} />
      </Fab>

      {/* ADD MODAL - Matches the white popup */}
      <Dialog 
        open={isAddOpen} 
        onClose={() => dispatch(toggleAddModal(false))} 
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        fullWidth 
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>Add to Dictionary</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus 
            margin="dense" 
            label="New Word" 
            fullWidth 
            variant="standard"
            value={newWordText} 
            onChange={(e) => setNewWordText(e.target.value)}
            InputLabelProps={{ sx: { color: '#999' } }}
          />
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={() => dispatch(toggleAddModal(false))} sx={{ color: '#E30425', fontWeight: 'bold' }}>CANCEL</Button>
          <Button onClick={handleAdd} disabled={adding} sx={{ color: '#E30425', fontWeight: 'bold' }}>ADD</Button>
        </DialogActions>
      </Dialog>

      {/* DETAIL MODAL - Matches the full screen white detail view */}
      <Dialog 
        fullScreen 
        open={Boolean(selectedWord)} 
        onClose={() => setSelectedWord(null)}
      >
        <Paper sx={{ height: '100%', borderRadius: 0, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => setSelectedWord(null)} size="large">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', letterSpacing: '-1px' }}>
              {selectedWord?.text}
            </Typography>
            
            <Typography variant="body1" sx={{ mt: 2, color: '#666', fontStyle: 'italic' }}>
              {selectedWord?.lexicalCategory}
            </Typography>

            <Typography variant="body1" sx={{ mt: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
              {selectedWord?.definition}
            </Typography>

            {selectedWord?.example && (
              <Box sx={{ mt: 3, pl: 2, borderLeft: '4px solid #E30425' }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#555' }}>
                  "{selectedWord.example}"
                </Typography>
              </Box>
            )}

            {selectedWord?.audioUrl && (
              <Fab 
                size="medium" 
                sx={{ mt: 5, bgcolor: '#5D1049', color: 'white', '&:hover': { bgcolor: '#4a0d3a' } }}
                onClick={() => new Audio(selectedWord.audioUrl!).play()}
              >
                <VolumeUp />
              </Fab>
            )}
          </Box>
        </Paper>
      </Dialog>
    </>
  );
}