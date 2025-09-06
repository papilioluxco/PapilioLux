# Overview

This is a personal goal tracking and habit building application called "Papilio" built with Next.js and TypeScript. The app helps users organize their life goals across different categories (finances, health, relationships, etc.) using a todo-based system with a gamification element called "beans" as rewards. The application uses client-side localStorage for data persistence and features a clean, section-based interface for managing life goals across 12 different life areas.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 15.2.3 with TypeScript for type safety and developer experience
- **Styling**: Tailwind CSS 4.0.15 for utility-first styling approach
- **Fonts**: Google Fonts integration (Montserrat) loaded via Next.js Head component
- **State Management**: React hooks (useState, useEffect) for local component state
- **Data Persistence**: Browser localStorage for client-side data storage

## Component Structure
- **Pages Router**: Uses Next.js pages directory structure with `_app.tsx` for global layout
- **Main Interface**: Single-page application with todo management across predefined life categories
- **Type Safety**: Custom TypeScript interfaces for Todo and Section data structures

## Data Architecture
- **Storage Strategy**: Client-side localStorage with JSON serialization
- **Data Models**: 
  - Todo items with id, text, completion status, creation date, and section categorization
  - Predefined sections covering 12 life areas with slug, label, and emoji icon
- **State Persistence**: Automatic save/load from localStorage on component mount and updates

## Gamification System
- **Reward Mechanism**: "Beans" counter as achievement tracking
- **Progress Tracking**: Visual feedback through completion status and counters

# External Dependencies

## Core Framework Dependencies
- **Next.js**: React framework for server-side rendering and static generation
- **React/React-DOM**: Core React libraries for UI component rendering
- **TypeScript**: Static type checking and enhanced developer experience

## Styling Dependencies
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Google Fonts**: External font service (Montserrat font family)

## Development Tools
- **ESLint**: Code linting with Next.js specific configurations
- **Next.js ESLint Config**: Pre-configured linting rules for Next.js projects

## Deployment Configuration
- **Vercel**: Deployment configuration present for Vercel platform hosting
- **Replit**: Development environment configuration for Replit hosting

Note: The application currently uses localStorage for data persistence. No external databases or backend services are currently integrated, making this a fully client-side application.