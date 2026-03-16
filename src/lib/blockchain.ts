// Blockchain class — genesis, addBlock, validate, computeHash

import { hashString } from './hash';
import { createServerClient } from './supabase';
import type { Block, ChainValidationResult } from './types';

export class Blockchain {
  /**
   * Create the genesis block (first block in the chain)
   */
  static createGenesisBlock(): Block {
    const timestamp = new Date().toISOString();
    const data = {
      message: 'Genesis Block - CYFER Blockchain Initialized',
      system: 'CYFER v1.0',
    };

    const block: Block = {
      id: 0,
      timestamp,
      data,
      previous_hash: '0',
      hash: '',
      nonce: 0,
    };

    // Compute hash for genesis block
    const hashInput = `${block.id}${block.timestamp}${JSON.stringify(block.data)}${block.previous_hash}${block.nonce}`;
    // Note: We'll compute this synchronously for genesis block initialization
    block.hash = hashInput; // Placeholder - will be computed properly on insertion

    return block;
  }

  /**
   * Compute SHA-256 hash for a block
   * Hash = SHA-256(id + timestamp + JSON.stringify(data) + previous_hash + nonce)
   */
  static async computeHash(block: Partial<Block>): Promise<string> {
    const hashInput = `${block.id}${block.timestamp}${JSON.stringify(block.data)}${block.previous_hash}${block.nonce}`;
    return await hashString(hashInput);
  }

  /**
   * Fetch the latest block from the blockchain table
   */
  static async getLatestBlock(): Promise<Block | null> {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('blockchain')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found - chain is empty
        return null;
      }
      throw new Error(`Failed to fetch latest block: ${error.message}`);
    }

    return data as Block;
  }

  /**
   * Add a new block to the blockchain
   * @param data - Block data (document hash, action, etc.)
   * @returns The newly created block
   */
  static async addBlock(data: Record<string, any>): Promise<Block> {
    const supabase = createServerClient();

    // Get the latest block to link to it
    const latestBlock = await this.getLatestBlock();

    // Determine the next block ID and previous hash
    const id = latestBlock ? latestBlock.id + 1 : 0;
    const previous_hash = latestBlock ? latestBlock.hash : '0';

    // Create the new block
    const timestamp = new Date().toISOString();
    const nonce = Math.floor(Math.random() * 1000000); // Simple nonce

    const newBlock: Partial<Block> = {
      id,
      timestamp,
      data,
      previous_hash,
      nonce,
    };

    // Compute the hash for this block
    const hash = await this.computeHash(newBlock);

    // Insert the block into the database
    const { data: insertedBlock, error } = await supabase
      .from('blockchain')
      .insert({
        ...newBlock,
        hash,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add block to blockchain: ${error.message}`);
    }

    return insertedBlock as Block;
  }

  /**
   * Validate the entire blockchain
   * Checks:
   * 1. Each block's hash matches its computed hash
   * 2. Each block's previous_hash matches the prior block's hash
   */
  static async validateChain(): Promise<ChainValidationResult> {
    const supabase = createServerClient();

    // Fetch all blocks ordered by ID
    const { data: blocks, error } = await supabase
      .from('blockchain')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      return {
        valid: false,
        errors: [`Failed to fetch blockchain: ${error.message}`],
      };
    }

    if (!blocks || blocks.length === 0) {
      return {
        valid: true,
        errors: [],
      };
    }

    const errors: string[] = [];

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i] as Block;

      // Check 1: Verify the block's hash matches its computed hash
      const computedHash = await this.computeHash(block);
      if (block.hash !== computedHash) {
        errors.push(`Block ${block.id}: Hash mismatch. Expected ${computedHash}, got ${block.hash}`);
      }

      // Check 2: Verify the previous_hash linkage (skip for genesis block)
      if (i > 0) {
        const previousBlock = blocks[i - 1] as Block;
        if (block.previous_hash !== previousBlock.hash) {
          errors.push(
            `Block ${block.id}: previous_hash mismatch. Expected ${previousBlock.hash}, got ${block.previous_hash}`
          );
        }
      } else {
        // Genesis block should have previous_hash = '0'
        if (block.previous_hash !== '0') {
          errors.push(`Genesis block (ID ${block.id}): previous_hash should be '0', got ${block.previous_hash}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Initialize the blockchain by creating the genesis block if it doesn't exist
   */
  static async initialize(): Promise<void> {
    const latestBlock = await this.getLatestBlock();

    if (!latestBlock) {
      // No blocks exist - create the genesis block
      const genesisBlock = this.createGenesisBlock();
      await this.addBlock(genesisBlock.data);
    }
  }
}
