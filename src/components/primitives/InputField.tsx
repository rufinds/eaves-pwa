import { TextInput, View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, fontSize, radius, layout, spacing } from '../../theme/tokens';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  error?: string;
  testID?: string;
  onSubmitEditing?: () => void;
}

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  testID,
  onSubmitEditing,
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      <Text size="sm" weight="medium">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[styles.input, error !== undefined && styles.inputError]}
        testID={testID}
        autoCapitalize="none"
        onSubmitEditing={onSubmitEditing}
      />
      {error !== undefined && <Text size="sm" tone="error">{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  input: {
    minHeight: layout.touchTarget,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: radius.md,
    color: colors.text,
    fontSize: fontSize.lg,
  },
  inputError: { borderColor: colors.error },
});
