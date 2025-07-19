package user

import "context"

// Service defines the contract for user and seller-related operations.
// It clearly separates the logic for different roles within the system.
type Service interface {
	// RegisterUser handles the creation of a new buyer account.
	RegisterUser(ctx context.Context, name, email, password string) (*User, error)

	// RegisterSeller handles the creation of a new seller account.
	RegisterSeller(ctx context.Context, name, email, password, phone string) (*User, error)

	// Authenticate verifies a user's credentials and returns the user object
	// along with a JWT or session token. It handles both 'user' and 'seller' roles.
	Authenticate(ctx context.Context, email, password string) (user *User, token string, err error)

	// GetUserByID retrieves a user by their unique ID.
	GetUserByID(ctx context.Context, id string) (*User, error)

	// GetSellerProfileByID retrieves the detailed public profile for a seller.
	GetSellerProfileByID(ctx context.Context, id string) (*SellerProfile, error)

	// UpdateSellerProfile updates the profile information for a specific seller.
	UpdateSellerProfile(ctx context.Context, profile SellerProfile) error
}
